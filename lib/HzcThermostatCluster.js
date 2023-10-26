'use strict'

const { Cluster, ThermostatCluster, ZCLDataTypes, zclTypes } = require(
  'zigbee-clusters')

const ATTRIBUTES = {
  localTemperature: { id: 0, type: ZCLDataTypes.int16 },
  outdoorTemperature: { id: 1, type: ZCLDataTypes.int16 },
  occupancy: { id: 2, type: ZCLDataTypes.map8('occupied') },
  absMinHeatSetpointLimit: { id: 3, type: ZCLDataTypes.int16 },
  absMaxHeatSetpointLimit: { id: 4, type: ZCLDataTypes.int16 },
  absMinCoolSetpointLimit: { id: 5, type: ZCLDataTypes.int16 },
  absMaxCoolSetpointLimit: { id: 6, type: ZCLDataTypes.int16 },
  pICoolingDemand: { id: 7, type: ZCLDataTypes.uint8 },
  pIHeatingDemand: { id: 8, type: ZCLDataTypes.uint8 },
  localTemperatureCalibration: { id: 16, type: ZCLDataTypes.int8 },
  occupiedCoolingSetpoint: { id: 17, type: ZCLDataTypes.int16 },
  occupiedHeatingSetpoint: { id: 18, type: ZCLDataTypes.int16 },
  unoccupiedCoolingSetpoint: { id: 19, type: ZCLDataTypes.int16 },
  unoccupiedHeatingSetpoint: { id: 20, type: ZCLDataTypes.int16 },
  minHeatSetpointLimit: { id: 21, type: ZCLDataTypes.int16 },
  maxHeatSetpointLimit: { id: 22, type: ZCLDataTypes.int16 },
  minCoolSetpointLimit: { id: 23, type: ZCLDataTypes.int16 },
  maxCoolSetpointLimit: { id: 24, type: ZCLDataTypes.int16 },
  minSetpointDeadBand: { id: 25, type: ZCLDataTypes.int8 },
  remoteSensing: {
    id: 26,
    type: ZCLDataTypes.map8('localTemperature', 'outdoorTemperature',
      'occupancy'),
  },
  controlSequenceOfOperation: {
    id: 27,
    type: ZCLDataTypes.enum8({
      cooling: 0,
      coolingWithReheat: 1,
      heating: 2,
      heatingWithReheat: 3,
      coolingAndHeating4Pipes: 4,
      coolingAndHeating4PipesWithReheat: 5,
    }),
  },
  systemMode: {
    id: 28,
    type: ZCLDataTypes.enum8({
      off: 0,
      auto: 1,
      cool: 3,
      heat: 4,
      emergencyHeating: 5,
      precooling: 6,
      fanOnly: 7,
      dry: 8,
      sleep: 9,
    }),
  },
  alarmMask: {
    id: 29,
    type: ZCLDataTypes.map8('initializationFailure', 'hardwareFailure',
      'selfCalibrationFailure'),
  },

  thermostatRunningMode:{
    id: 30,
    type: ZCLDataTypes.enum8({
      off: 0,
      cool:3,
      heat: 4,
      idle: 16, 
    })
  }, 
 

  /*
  thermostatProgramOperModel:{
    id: 37,
    type: ZCLDataTypes.enum8({
      manual:  0,
      program: 1,
      eco: 4,
      auto: 5,
    }), 
  },
  */ 
  
  thermostatProgramOperModel:{
    id: 37,
    //type: ZCLDataTypes.map8('program', 'manual', 'eco', 'set_eco'), 
    type: ZCLDataTypes.map8('program', 'auto', 'eco')
  },  

  windowCheck: {
    id: 32768,
    type: ZCLDataTypes.bool,
  },
  
  /*
  frost: {
    id: 32769,  //0x8001
    type: ZCLDataTypes.enum8({
      closed: 0,
      opened: 1,
    }),
  },*/
  frost: {
    id: 32769,  //0x8001
    type: ZCLDataTypes.bool
  },  

  

  windowState: {
    id: 32770,  //0x8002
    type: ZCLDataTypes.bool,
  },

  workDays: {
    id: 0x8003,
    type: ZCLDataTypes.int8,
  },

  sensorMode:{
    id: 0x8004,
    type: ZCLDataTypes.enum8({
      a: 0,
      f: 1,
      af : 2,
      a2: 3,
      a2f: 4,
      fp: 5,
      p: 6,
    }),
  },

  backlight:{
    id: 0x8005,
    type: ZCLDataTypes.uint8,
  },

  fault:{
    id: 0x8006,
    type: ZCLDataTypes.map8('er1','er2','er3','er4','er5','er6','er7','er8')
  },

  regulator: {
    id: 0x8007,
    type: ZCLDataTypes.uint8,
  },
 
  dryModeCountDown: { 
    id: 0x8008,
    type: ZCLDataTypes.int8,
  },

  backlightSwitch: {
    id: 0x8009,
    type: ZCLDataTypes.bool
  },

  syncTimeReq:{
    id: 0x800A,
    type: ZCLDataTypes.bool
  },

  syncTime: {
    id: 0x800B,
    type: ZCLDataTypes.uint32
  }
        
}

const COMMANDS = {
  setSetpoint: {
    id: 0,
    args: {
      mode: ZCLDataTypes.enum8({
        heat: 0,
        cool: 1,
        both: 2,
      }),
      amount: ZCLDataTypes.int8,
    },
  }, 

  setEco: {
    id: 0x08,
    args:{
      ecoMode: ZCLDataTypes.bool
    }
  },

  setProgram : {
    id: 0x07,
    args:{
      runMode: ZCLDataTypes.bool
    }
  },
 
  
}

class HzcThermostatCluster extends ThermostatCluster {

  static get ATTRIBUTES () {
    return ATTRIBUTES
  }

  static get COMMANDS () {
    return COMMANDS
  }

}

module.exports = HzcThermostatCluster
