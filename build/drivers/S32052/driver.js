'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this._levelStepActionCard = this.getActionCard('S32052_level_step_with_onoff')
    this._levelStepActionCard.registerRunListener((args, state) => {
      return args.device.levelStepRunListener(args, state)
    })

    this._levelMoveActionCard = this.getActionCard('S32052_level_move_with_onoff')
    this._levelMoveActionCard.registerRunListener((args, state) => {
      return args.device.levelMoveRunListener(args, state)
    })

    this._levelStopActionCard = this.getActionCard('S32052_level_stop_with_onoff')
    this._levelStopActionCard.registerRunListener((args, state) => {
      return args.device.levelStopRunListener(args, state)
    })

    this._stepColorTemperatureActionCard = this.getActionCard(
      'S32052_step_color_temperature')
    this._stepColorTemperatureActionCard.registerRunListener((args, state) => {
      return args.device.stepColorTemperatureRunListener(args, state)
    })

    this._moveColorTemperatureActionCard = this.getActionCard(
      'S32052_move_color_temperature')
    this._moveColorTemperatureActionCard.registerRunListener((args, state) => {
      return args.device.moveColorTemperatureRunListener(args, state)
    })

    this._stopMoveStepActionCard = this.getActionCard(
      'S32052_stop_move_step')
    this._stopMoveStepActionCard.registerRunListener((args, state) => {
      return args.device.stopMoveStepRunListener(args, state)
    })

    this._recallSceneActionCard = this.getActionCard('S32052_recall_scene')
    this._recallSceneActionCard.registerRunListener((args, state) => {
      return args.device.recallSceneRunListener(args, state)
    })

    this._storeSceneActionCard = this.getActionCard('S32052_store_scene')
    this._storeSceneActionCard.registerRunListener((args, state) => {
      return args.device.storeSceneRunListener(args, state)
    })
  }

}

module.exports = MyDriver
