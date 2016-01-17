import Html
import Html.Events
import Html.Attributes
import Json.Decode as Json exposing ((:=))
import Regex

-- CONFIG

page_size: Int
page_size = 10

-- MODEL

type alias Garage =
  { vehicles: List Vehicle
  , places: List (Int, Int) -- (Level, Spot)
  , query: String
  , page: Int
  , filters: { level: List Int, kind: List String }
  }

type Filter
  = Level Int
  | Kind String

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
  , filters = { level = [], kind = [] }
  }

allPlaces : List (Int, Int)
allPlaces =
  List.foldr
    (\places p -> List.append places p)
    []
    (List.indexedMap
      (\lvl nb -> (List.indexedMap (\i _ -> (lvl, i)) (List.repeat nb 0)))
      [10,20,30,20,10])

-- UPDATE

type Action
  = NoOp
  | ToggleFilter Filter
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
    ToggleFilter filter ->
      let filters = garage.filters in
      case filter of
          Level lvl ->
            if List.member lvl garage.filters.level
            then
              let filters = { filters | level = List.filter (\x -> x /= lvl) garage.filters.level }
              in { garage | filters = filters }
            else { garage | filters = { level = lvl::garage.filters.level, kind = garage.filters.kind } }
          Kind k ->
            if List.member k garage.filters.kind
            then
              let filters = { filters | kind = List.filter (\x -> x /= k) garage.filters.kind }
              in { garage | filters = filters }
            else { garage | filters = { kind = k::garage.filters.kind, level = garage.filters.level } }

-- VIEW

view : Signal.Address Action -> Garage -> Html.Html
view address model =
  Html.div
  []
  [ Html.input
    [ Html.Attributes.placeholder "query"
    , Html.Events.on
      "change"
      (Json.at ["target", "value"] Json.string)
      (\v -> Signal.message address (UpdateQuery v))
    ]
    []
  , Html.div
    []
    (renderVehicles (filterVehicles model.query model.vehicles))
  ]

renderVehicles : List Vehicle -> List Html.Html
renderVehicles =
  List.map (\x -> Html.div [] [Html.text x.license, Html.text x.kind])

filterVehicles: String -> List Vehicle -> List Vehicle
filterVehicles q xs =
  let reg = Regex.regex q in
    List.filter ((Regex.contains reg) << .license) xs

-- WIRING

main : Signal Html.Html
main =
  Signal.map (view actions.address) garage

garage : Signal Garage
garage =
  Signal.foldp update emptyGarage actions.signal

actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp
