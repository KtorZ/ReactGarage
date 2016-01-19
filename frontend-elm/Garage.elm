import Html
import Html.Events
import Html.Attributes
import Json.Decode as Json exposing ((:=))
import Regex
import Dict

-- CONFIG

page_size: Int
page_size = 10

----------------------------------------- MODEL

type alias Garage =
  { vehicles: List Vehicle
  , places: List (Int, Int) -- (Level, Spot)
  , query: String
  , page: Int
  , filters: List Int
  }

type alias Vehicle =
  { license: String
  , kind: String
  , spot: Int
  , level: Int
  }

emptyGarage : Garage
emptyGarage =
  { vehicles =
    [  Vehicle "vsdfnodf" "Car" 1 0
    ,  Vehicle "diosonpx" "Car" 2 0
    ,  Vehicle "cmnaudg" "Motorbike" 3 1
    ,  Vehicle "dsvcbpo" "Car" 2 1
    ,  Vehicle "dfnmodf" "Motorbike" 1 1
    ,  Vehicle "xcpovkn" "Motorbike" 4 0
    ,  Vehicle "xcmvni" "Car" 3 0
    ,  Vehicle "suifojn" "Car" 2 1
    ]
  , places = allPlaces
  , query = ""
  , page = 0
  , filters = []
  }

allPlaces : List (Int, Int)
allPlaces =
  List.foldr
    (\places p -> List.append places p)
    []
    (List.indexedMap
      (\lvl nb -> (List.indexedMap (\i _ -> (lvl, i)) (List.repeat nb 0)))
      [10,20,30,20,10])

filterNames : Dict.Dict Int String
filterNames = Dict.fromList
  [(0,"Level 1")
  ,(1,"Level 2")
  ,(2,"Level 3")
  ,(3,"Level 4")
  ,(4,"Level 5")
  ,(100,"Car")
  ,(101,"Motorbike")
  ]

levels : List Int
levels =
  filterNames
    |> Dict.keys
    |> List.filter ((>) 100)

types : List Int
types =
  List.filter ((<=) 100) (Dict.keys filterNames)


----------------------------------------- UPDATE

type Action
  = NoOp
  | ToggleFilter Int
  | UpdateQuery String
  | EnterVehicle String String
  | ExitVehicle String
  | NextPage
  | PrevPage

update : Action -> Garage -> Garage
update action garage =
  case action of
    NoOp -> garage
    UpdateQuery q ->
      { garage | query = q }
    NextPage ->
      if garage.page > 0
      then { garage | page = garage.page - 1 }
      else garage
    PrevPage ->
      if List.length garage.vehicles // (page_size * (garage.page + 1)) > 0
      then { garage | page = garage.page + 1 }
      else garage
    EnterVehicle license kind ->
        if List.member license (List.map .license garage.vehicles)
        then garage
        else let place = List.head garage.places in
          case place of
            Just (level, spot) ->
              { garage
              | places = List.drop 1 garage.places
              , vehicles = (Vehicle license kind spot level)::garage.vehicles
              }
            Nothing ->
              garage

    ExitVehicle license ->
        { garage | vehicles = List.filter (\x -> x.license /= license) garage.vehicles }
    ToggleFilter f ->
      if List.member f garage.filters
      then { garage | filters = List.filter (\x -> x /= f) garage.filters }
      else { garage | filters = f::garage.filters }

----------------------------------------- VIEW

view : Signal.Address Action -> Garage -> Html.Html
view address model =
  Html.div
    [ Html.Attributes.class "wrapper" ]
    [ Html.div [ Html.Attributes.class "navbar" ] [ Html.text "Vehicles" ]
    , Html.div [ Html.Attributes.class "sides" ]
        [ Html.div [ Html.Attributes.class "filtering" ] (viewFiltering address model)
        , Html.div [ Html.Attributes.class "listing" ] (viewListing address model)
        ]
    , Html.div [ Html.Attributes.class "handy-ui" ] (viewHandyUI address model)
    ]

----- FILTERING

viewFiltering : Signal.Address Action -> Garage -> List Html.Html
viewFiltering address model =
  [ Html.div [ Html.Attributes.id "search_bar" ]
    [ Html.div [ Html.Attributes.class "search_bar" ]
      [ Html.span [ Html.Attributes.class "icon" ]
        [ Html.i [ Html.Attributes.class "fa fa-search" ] [] ]
      , Html.input
        [ Html.Attributes.type' "search"
        , Html.Events.on "change"
          (Json.at ["target", "value"] Json.string)
          (\v -> Signal.message address (UpdateQuery v))
        ]
        []
      ]
    ]
  , Html.div [ Html.Attributes.id "filters" ]
    [ Html.div [ Html.Attributes.class "filters" ]
      [ Html.h4 [] [ Html.text "Level" ]
      ,Html.ul [] (List.map (filtersToLi address model) levels)
      ]
    , Html.div [ Html.Attributes.class "filters" ]
      [ Html.h4 [] [ Html.text "Type" ]
      ,Html.ul [] (List.map (filtersToLi address model) types)
      ]
    ]
  ]

filtersToLi : Signal.Address Action -> Garage -> Int -> Html.Html
filtersToLi address garage filter =
  let
      class = if (List.member filter garage.filters) then "active" else ""
      displayName = case (Dict.get filter filterNames) of
        Just name -> name
        Nothing -> ""
  in
    Html.li
      [ Html.Attributes.class class, Html.Events.onClick address (ToggleFilter filter) ]
      [ Html.span [] [ Html.text displayName] ]

----- LISTING

viewListing : Signal.Address Action -> Garage -> List Html.Html
viewListing address model =
  []

renderVehicles : List Vehicle -> List Html.Html
renderVehicles =
  List.map (\x -> Html.div [] [Html.text x.license, Html.text x.kind])

filterVehicles: String -> List Vehicle -> List Vehicle
filterVehicles q xs =
  let reg = Regex.regex q in
    List.filter ((Regex.contains reg) << .license) xs

----- HANDY-UI

viewHandyUI : Signal.Address Action -> Garage -> List Html.Html
viewHandyUI address model =
  []

----------------------------------------- WIRING

main : Signal Html.Html
main =
  let
    actions = Signal.mailbox NoOp
    garage = Signal.foldp update emptyGarage actions.signal
  in
    Signal.map (view actions.address) garage
