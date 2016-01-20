import Html
import Html.Events
import Html.Attributes
import Json.Decode as Json exposing ((:=))
import Regex
import Dict
import String


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
      [1,2,3,2,1])


filterNames : Dict.Dict Int String
filterNames = Dict.fromList
  [(0,"Level 0")
  ,(1,"Level 1")
  ,(2,"Level 2")
  ,(3,"Level 3")
  ,(4,"Level 4")
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
  filterNames
    |> Dict.keys
    |> List.filter ((<=) 100)

----------------------------------------- MODEL

type alias Garage =
  { vehicles: List Vehicle
  , places: List (Int, Int) -- (Level, Slot)
  , query: String
  , page: Int
  , filters: List Int
  , formLicense: String
  , formType: Int
  }


type alias Vehicle =
  { license: String
  , kind: Int
  , slot: Int
  , level: Int
  }


emptyGarage : Garage
emptyGarage =
  { vehicles = []
  , places = allPlaces
  , query = ""
  , page = 0
  , filters = []
  , formLicense = ""
  , formType = 100
  }

----------------------------------------- UPDATE

type Action
  = NoOp
  | ToggleFilter Int
  | UpdateQuery String
  | EnterVehicle
  | ExitVehicle
  | NextPage
  | PrevPage
  | SetFormLicense String
  | SetFormType Int


nextPossible : Int -> Int -> Int -> Bool
nextPossible nb size p =
  size * (p + 1) < nb

prevPossible : Int -> Int -> Int -> Bool
prevPossible nb size p =
  p > 0


update : Action -> Garage -> Garage
update action garage =
  case action of
    NoOp -> garage
    UpdateQuery q ->
      if String.length q < 3
      then garage
      else { garage | query = q }
    PrevPage ->
      if prevPossible (List.length garage.vehicles) page_size garage.page
      then { garage | page = garage.page - 1 }
      else garage
    NextPage->
      if nextPossible (List.length garage.vehicles) page_size garage.page
      then { garage | page = garage.page + 1 }
      else garage
    EnterVehicle ->
        if List.member garage.formLicense (List.map .license garage.vehicles)
        then garage
        else let place = List.head garage.places in
          case place of
            Just (level, slot) ->
              { garage
              | places = List.drop 1 garage.places
              , vehicles = (Vehicle garage.formLicense garage.formType slot level)::garage.vehicles
              }
            Nothing ->
              garage

    ExitVehicle ->
        { garage | vehicles = List.filter (\x -> x.license /= garage.formLicense) garage.vehicles }
    ToggleFilter f ->
      if List.member f garage.filters
      then { garage | filters = List.filter (\x -> x /= f) garage.filters }
      else { garage | filters = f::garage.filters }
    SetFormLicense l ->
      { garage | formLicense = l }
    SetFormType t ->
      { garage | formType = t }

----------------------------------------- VIEW

view : Signal.Address Action -> Garage -> Html.Html
view address model =
  Html.div
    [ Html.Attributes.class "wrapper" ]
    [ Html.div [ Html.Attributes.class "navbar" ]
      [ Html.span [ Html.Attributes.class "icon" ]
        [ Html.i [ Html.Attributes.class "fa fa-bars"] [] ]
      , Html.span [ Html.Attributes.class "title" ] [ Html.text "Vehicles" ]
      ]
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
        , Html.Events.on "keyup"
          (Json.at ["target", "value"] Json.string)
          (Signal.message address << UpdateQuery)
        ]
        []
      ]
    ]
  , Html.div [ Html.Attributes.id "filters" ]
    [ Html.div [ Html.Attributes.class "filters" ]
      [ Html.h4 [] [ Html.text "Levels" ]
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
      classUp = if nextPossible nbVehicles page_size model.page then "icon enabled" else "icon"
      classDown = if prevPossible nbVehicles page_size model.page then "icon enabled" else "icon"
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
          , Html.Events.onClick address NextPage
          ]
          [ Html.i [ Html.Attributes.class "fa fa-angle-up" ] [] ]
        , Html.span
          [ Html.Attributes.class classDown
          , Html.Events.onClick address PrevPage
          ]
          [ Html.i [ Html.Attributes.class "fa fa-angle-down" ] [] ]
        ]
      ]
    , Html.div [ Html.Attributes.class "vehicle_list" ]
        (List.map vehicleToDiv (((List.take page_size) << (List.drop (lowerBound - 1))) vehicles))
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
        , Html.text ("Slot: " ++ (toString (vehicle.slot + 1)))
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
  let
    options = List.map
      (\t -> let kind = case (Dict.get t filterNames) of
          Just k -> k
          Nothing -> "Unknown"
        in Html.option [ Html.Attributes.value (toString t) ] [ Html.text kind ])
      types
    onChangeSelect = \x -> case (String.toInt x) of
      Ok str -> SetFormType str
      Err _ -> NoOp
  in
    [ Html.div []
      [ Html.input
        [ Html.Attributes.type' "text"
        , Html.Attributes.placeholder "License"
        , Html.Events.on
            "keyup"
            Html.Events.targetValue
            (Signal.message address << SetFormLicense)
        ]
        []
      , Html.select
        [ Html.Events.on
            "change"
            Html.Events.targetValue
            (Signal.message address << onChangeSelect)
        ]
        options
      , Html.div
        [ Html.Attributes.class "button enter"
        , Html.Events.onClick address EnterVehicle
        ]
        [ Html.span [ Html.Attributes.class "icon" ]
          [ Html.i [ Html.Attributes.class "fa fa-car" ] [] ]
        , Html.span [] [ Html.text "Enter" ]
        ]
      , Html.div
        [ Html.Attributes.class "button exit"
        , Html.Events.onClick address ExitVehicle
        ]
        [ Html.span [ Html.Attributes.class "icon" ]
          [ Html.i [ Html.Attributes.class "fa fa-sign-out" ] [] ]
        , Html.span [] [ Html.text "Exit" ]
        ]
    ]
  --, Html.div []
  --  [ Html.div
  --    [ Html.Attributes.class "button populate"
  --    -- TODO onClick populate
  --    ]
  --    [ Html.span [ Html.Attributes.class "icon" ]
  --      [ Html.i [ Html.Attributes.class "fa fa-magic" ] [] ]
  --    , Html.span [] [ Html.text "Populate" ]
  --    ]
  --  ]
  ]


----------------------------------------- WIRING

main : Signal Html.Html
main =
  let
    actions = Signal.mailbox NoOp
    garage = Signal.foldp update emptyGarage actions.signal
  in
    Signal.map (view actions.address) garage
