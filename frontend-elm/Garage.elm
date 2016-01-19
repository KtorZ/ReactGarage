import Html
import Html.Events
import Html.Attributes
import Json.Decode as Json exposing ((:=))
import Regex
import Dict


----------------------------------------- CONFIG

page_size: Int
page_size = 10


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

----------------------------------------- MODEL

type alias Garage =
  { vehicles: List Vehicle
  , places: List (Int, Int) -- (Level, Slot)
  , query: String
  , page: Int
  , filters: List Int
  }


type alias Vehicle =
  { license: String
  , kind: Int
  , slot: Int
  , level: Int
  }


emptyGarage : Garage
emptyGarage =
  { vehicles =
    [  Vehicle "vsdfnodf" 100 1 0
    ,  Vehicle "diosonpx" 100 2 0
    ,  Vehicle "cmnaudg" 101 3 1
    ,  Vehicle "dsvcbpo" 101 2 1
    ,  Vehicle "dfnmodf" 100 1 1
    ,  Vehicle "xcpovkn" 101 4 0
    ,  Vehicle "xcmvni" 100 3 0
    ,  Vehicle "suifojn" 100 2 1
    ]
  , places = allPlaces
  , query = ""
  , page = 0
  , filters = []
  }

----------------------------------------- UPDATE

type Action
  = NoOp
  | ToggleFilter Int
  | UpdateQuery String
  | EnterVehicle String Int
  | ExitVehicle String
  | NextPage
  | PrevPage


nextPossible : Int -> Int -> Int -> Bool
nextPossible nb size p =
  p > 0


prevPossible : Int -> Int -> Int -> Bool
prevPossible nb size p =
  nb // (size * (p + 1)) > 0


update : Action -> Garage -> Garage
update action garage =
  case action of
    NoOp -> garage
    UpdateQuery q ->
      { garage | query = q }
    NextPage ->
      if nextPossible (List.length garage.vehicles) page_size garage.page
      then { garage | page = garage.page - 1 }
      else garage
    PrevPage ->
      if prevPossible (List.length garage.vehicles) page_size garage.page
      then { garage | page = garage.page + 1 }
      else garage
    EnterVehicle license kind ->
        if List.member license (List.map .license garage.vehicles)
        then garage
        else let place = List.head garage.places in
          case place of
            Just (level, slot) ->
              { garage
              | places = List.drop 1 garage.places
              , vehicles = (Vehicle license kind slot level)::garage.vehicles
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
  let
      vehicles   = filterVehicles model.query model.filters model.vehicles
      nbVehicles = List.length vehicles
  in
  if nbVehicles == 0
  then
    []
  else
    let
      lowerBound = model.page * page_size + 1
      upperBound = min nbVehicles ((model.page + 1) * page_size)
      classUp = if prevPossible nbVehicles page_size model.page then "icon enabled" else "icon"
      classDown = if nextPossible nbVehicles page_size model.page then "icon enabled" else "icon"
    in
    [ Html.div [ Html.Attributes.class "pager" ]
      [ Html.div [ Html.Attributes.class "figures" ]
        [ Html.div [] [ (Html.text << toString) lowerBound ]
        , Html.div [] [ (Html.text << toString) upperBound ]
        ]
      , Html.div [ Html.Attributes.class "max" ]
        [ Html.text "/"
        , Html.span [ Html.Attributes.class "max-number" ] [(Html.text << toString) nbVehicles]
        ]
      , Html.div [ Html.Attributes.class "title" ] [ Html.text "Vehicles" ]
      , Html.div []
        [ Html.span
          [ Html.Attributes.class classUp
          , Html.Events.onClick address PrevPage
          ]
          [ Html.i [ Html.Attributes.class "fa fa-angle-up" ] [] ]
        , Html.span
          [ Html.Attributes.class classDown
          , Html.Events.onClick address NextPage
          ]
          [ Html.i [ Html.Attributes.class "fa fa-angle-down" ] [] ]
        ]
      ]
    , Html.div [ Html.Attributes.class "vehicle_list" ]
        (List.map vehicleToDiv vehicles)
    ]


vehicleToDiv : Vehicle -> Html.Html
vehicleToDiv vehicle =
  let
      kind = case (Dict.get vehicle.kind filterNames) of
        Just k -> k
        Nothing -> "Unknown"
      level = case (Dict.get vehicle.level filterNames) of
        Just l -> l
        Nothing -> "Unknown"
  in
    Html.div [ Html.Attributes.class "row" ]
      [ Html.div [ Html.Attributes.class "col" ]
        [ Html.text vehicle.license
        , Html.br [] []
        , Html.text kind
        ]
      , Html.div [ Html.Attributes.class "spacer" ] []
      , Html.div [ Html.Attributes.class "col" ]
        [ Html.text level
        , Html.br [] []
        , Html.text ("Slot: " ++ (toString vehicle.slot))
        ]
      ]


filterVehicles: String -> List Int -> List Vehicle -> List Vehicle
filterVehicles query filters vehicles =
  let
    filterTypes = List.partition ((>) 100) filters
    filtSearch = (Regex.contains (Regex.regex query)) << .license
    filtLevel =
      if List.length (fst filterTypes) == 0
      then \v -> True
      else flip List.member (fst filterTypes) << .level
    filtKind =
      if List.length (snd filterTypes) == 0
      then \v -> True
      else flip List.member (snd filterTypes) << .kind
  in
    List.foldr List.filter vehicles [filtSearch, filtLevel, filtKind]

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
