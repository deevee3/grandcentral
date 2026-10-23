import DashboardController from './DashboardController'
import TrainAboardController from './TrainAboardController'
import StationMasterController from './StationMasterController'
import CentralTowerController from './CentralTowerController'
import Settings from './Settings'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    TrainAboardController: Object.assign(TrainAboardController, TrainAboardController),
    StationMasterController: Object.assign(StationMasterController, StationMasterController),
    CentralTowerController: Object.assign(CentralTowerController, CentralTowerController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers