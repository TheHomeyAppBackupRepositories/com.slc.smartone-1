'use strict'

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER, TimeCluster } = require("zigbee-clusters");

class HzcSwitch2GangZigBeeDevice extends ZigBeeDevice {

  async onNodeInit ({
    zclNode
  }) {
    super.onNodeInit(
      { zclNode })
 
  } 

  onDeleted(){
		 
	}

  onoffCluster(endpoint) { return this.zclNode.endpoints[endpoint].clusters.onOff }

  async registerSwitchOnoff(endpoint){

    if (this.hasCapability('switch_'+endpoint)){
          this.registerCapability("switch_"+endpoint, CLUSTER.ON_OFF, {
            set: value => (value ? 'setOn' : 'setOff'),
            setParser: function(setValue) {
              this.log('------------onoff-set-command: ', setValue)

              if (!setValue) {   
                if (this.hasCapability('measure_power_'+endpoint)){
                  this.setCapabilityValue('measure_power_'+endpoint, 0).catch(this.error) 
                }
                if (this.hasCapability('rms_voltage_'+endpoint)){
                  this.setCapabilityValue('rms_voltage_'+endpoint, "0").catch(this.error) 
                } 
                if (this.hasCapability('rms_current_'+endpoint)){
                  this.setCapabilityValue('rms_current_'+endpoint, "0").catch(this.error) 
                }  
              }

              return setValue ? 'setOn' : 'setOff'; // This could also be an object for more complex 
            },
            get: 'onOff',
            report: 'onOff',
            endpoint: endpoint,
            reportParser: function(value){
              this.log('++=================================== onoff '+endpoint+' = ', value)
              return value;
            }, 
          }); 
          
          this.registerCapabilityListener("switch_"+endpoint, async isOn => {
                this.log('------------onoff-ui-send: ', isOn)

                if (isOn){
                    await this.onoffCluster(endpoint).setOn().catch( async (err) => {
                      this.setCapabilityValue("switch_"+endpoint, !isOn)
                      this.log('error: ', err)
                      throw new Error(""+err) 
                    })  
                }
                else {
                  await this.onoffCluster(endpoint).setOff().catch( async (err)  => {
                    this.log('error: ', err)
                    this.setCapabilityValue("switch_"+endpoint, !isOn)
                    throw new Error(""+err) 
                  })
                } 

          })


    }

    if (this.hasCapability('onoff_'+endpoint)){
      this.registerCapability("onoff_"+endpoint, CLUSTER.ON_OFF, {
        set: value => (value ? 'setOn' : 'setOff'),
        setParser: function(setValue) {
          return setValue ? 'setOn' : 'setOff';
        },
        get: 'onOff',
        report: 'onOff',
        endpoint: endpoint,
        reportParser: function(value){
          this.log('++onoff '+endpoint+' = ', value)
          return value;
        }, 
      }); 
    }

    if (this.hasCapability('onoff') && endpoint === 1){
          this.registerCapability("onoff", CLUSTER.ON_OFF, {
            set: value => (value ? 'setOn' : 'setOff'),
            setParser: function(setValue) {

              if (!setValue) {
                if (this.hasCapability('measure_power')){
                  this.setCapabilityValue('measure_power', 0).catch(this.error) 
                }
                if (this.hasCapability('rms_voltage')){
                  this.setCapabilityValue('rms_voltage', "0").catch(this.error) 
                } 
                if (this.hasCapability('rms_current')){
                  this.setCapabilityValue('rms_current', "0").catch(this.error) 
                }  
              }
              
              return setValue ? 'setOn' : 'setOff';
            },
            get: 'onOff',
            report: 'onOff',
            endpoint: endpoint,
            reportParser: function(value){
              this.log('++++++++++++++++onoff 1 = ', value)
              return value;
            }, 
          }); 

          this.registerCapabilityListener("onoff", async isOn => {
            this.log('------------onoff-ui-send: ', isOn)

            if (isOn){
                await this.onoffCluster(endpoint).setOn().catch( async (err) => {
                  this.setCapabilityValue("onoff", !isOn)
                  this.log('error: ', err)
                  throw new Error(""+err) 
                })  
            }
            else {
              await this.onoffCluster(endpoint).setOff().catch( async (err)  => {
                this.log('error: ', err)
                this.setCapabilityValue("onoff", !isOn)
                throw new Error(""+err) 
              })
            } 

          })
    }
    
  }

  async registerMeterPowerMeasurePower(endpoint) {
 
    //=========================================================================
    //=========================================================================
    //  meter_power 

    if (this.hasCapability('meter_power_'+endpoint)) { 
              this.registerCapability('meter_power_'+endpoint, CLUSTER.METERING, { 
                getParser: function(value) {
                  if (!this.app_inited) return 0
                  return value * this.params.meter_power.multiplier
                },
                get: 'currentSummationDelivered',
                report: 'currentSummationDelivered',  
                reportParser: function(value){
                  if (!this.app_inited) return 0
                  this.log('++report: meter_power_'+endpoint, value, this.params.meter_power.multiplier)
                  return value * this.params.meter_power.multiplier;
                }, 
                endpoint:endpoint,
                getOpts: {
                  getOnStart: true 
                } 
              })
    }
    if (this.hasCapability('meter_power') && endpoint === 1) {
       

            this.registerCapability('meter_power', CLUSTER.METERING, {
              get: 'currentSummationDelivered',
              report: 'currentSummationDelivered',  
              reportParser: function(value){
                if (!this.app_inited) return 0
                this.log('++report: meter_power_'+endpoint, value, this.params.meter_power.multiplier)
                return value * this.params.meter_power.multiplier;
              }, 
              getParser: function(value) {
                  if (!this.app_inited) return 0
                  return value * this.params.meter_power.multiplier
              },
              endpoint:endpoint,
              getOpts: {
                getOnStart: true 
              } 
            })
    }
    


    //=========================================================================
    //=========================================================================
    // measure_power  

    if (this.hasCapability('measure_power_'+endpoint)) {  

            this.registerCapability('measure_power_'+endpoint, CLUSTER.ELECTRICAL_MEASUREMENT, {
              get: 'activePower',
              report: 'activePower',
              reportParser: value => { 
                if (!this.app_inited) return 0
                this.log('========report: measure_power_'+endpoint, value, this.params.measure_power.multiplier)
                return value * this.params.measure_power.multiplier
              },
              getParser: function(value) {
                if (!this.app_inited) return 0
                return value * this.params.measure_power.multiplier
              },
              getOpts: {
                getOnStart: true 
              },
              endpoint:endpoint
            })
    }

    if (this.hasCapability('measure_power') && endpoint === 1) { 
        
            this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
              get: 'activePower',
              report: 'activePower',
              reportParser: value => {  
                if (!this.app_inited) return 0
                this.log('========report: measure_power_'+endpoint, value, this.params.measure_power.multiplier)
                return value * this.params.measure_power.multiplier 
              },
              getParser: function(value) {
                if (!this.app_inited) return 0
                return value * this.params.measure_power.multiplier
              },
              getOpts: {
                getOnStart: true 
              },
              endpoint:endpoint
            }) 

    }


  }
 
  registerDeviceTemperatureAlarm(){
    if (this.hasCapability('device_temperature_alarm')){ 

      this.registerCapability('device_temperature_alarm', CLUSTER.DEVICE_TEMPERATURE, {
        get: 'deviceTempAlarmMask',
        report: 'deviceTempAlarmMask',
        reportParser: value => { 
          this.log(`deviceTempAlarmMask `, value) 
          const res = value.getBits()
          if (res.length > 0){
            return res[0] 
          } 
          return 'Temperature Normal'
        },
        getOpts: {
          getOnStart: true, pollInterval: 60*60*1000, getOnOnline: true
        },
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 10,  
            maxInterval: 60000,  
            minChange: 0.5,
          },
        },
      }) 

    }
  }

  registerAcAlarm(){
    if (this.hasCapability('ac_alarm')){ 

      this.registerCapability('ac_alarm', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'acAlarmsMask',
        report: 'acAlarmsMask',
        reportParser: value => { 
          this.log(`acAlarmsMask `, value) 
          const res = value.getBits()
          if (res.length > 0){
            return res[0] 
          } 
          return 'No'
        },
        getOpts: {
          getOnStart: true, pollInterval: 60*60*1000, getOnOnline: true
        },
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 10,  
            maxInterval: 60000,  
            minChange: 0.5,
          },
        },
      })  

    }
  }

  registerAlarm(){
    if (this.hasCapability('alarm_contact')){ 

      this.registerCapability('alarm_contact', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'acAlarmsMask',
        report: 'acAlarmsMask',
        reportParser: value => { 
          this.log(`acAlarmsMask `, value) 
          const res = value.getBits()
          if (res.length > 0){
            return true 
          } 
          return false
        },
        getOpts: {
          getOnStart: true, pollInterval: 60*60*1000, getOnOnline: true
        },
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 10,  
            maxInterval: 60000,  
            minChange: 0.5,
          },
        },
      }) 

    } 

  }

  async registerRmsVoltage(endpoint){
    if (this.hasCapability('rms_voltage') && endpoint === 1){ 
        
              this.registerCapability('rms_voltage', CLUSTER.ELECTRICAL_MEASUREMENT, {
                get: 'rmsVoltage',
                report: 'rmsVoltage', 
                reportParser: value => {  
                  if (!this.app_inited) return 0
                  this.log('========report: rmsVoltage-'+endpoint, value, this.params.rms_voltage.multiplier)
                  return (value * this.params.rms_voltage.multiplier).toFixed(1)
                },
                getParser: function(value) {
                  if (!this.app_inited) return 0
                  return (value * this.params.rms_voltage.multiplier).toFixed(1)
                },
                getOpts: {
                  getOnStart: true 
                },
                endpoint:endpoint
              }) 
    }

    if (this.hasCapability('rms_voltage_'+endpoint)){
        
              this.registerCapability('rms_voltage_'+endpoint, CLUSTER.ELECTRICAL_MEASUREMENT, {
                get: 'rmsVoltage',
                report: 'rmsVoltage',  
                reportParser: value => {  
                  if (!this.app_inited) return 0
                  this.log('========report: rmsVoltage-'+endpoint, value, this.params.rms_voltage.multiplier) 
                  return (value * this.params.rms_voltage.multiplier).toFixed(1)
                },
                getParser: function(value) {
                  if (!this.app_inited) return 0
                  return (value * this.params.rms_voltage.multiplier).toFixed(1)
                }, 
                getOpts: {
                  getOnStart: true 
                }, 
                endpoint:endpoint
              }) 
    }  
       
  }

  async registerRmsCurrent(endpoint){
    if (this.hasCapability('rms_current') && endpoint === 1){ 
        
              this.registerCapability('rms_current', CLUSTER.ELECTRICAL_MEASUREMENT, {
                get: 'rmsCurrent',
                report: 'rmsCurrent', 
                reportParser: value => {  
                  if (!this.app_inited) return 0
                  this.log('========report: rms_current-'+endpoint, value, this.params.rms_current.multiplier)
                  return  (value * this.params.rms_current.multiplier).toFixed(2)
                },
                getParser: function(value) {
                  if (!this.app_inited) return 0
                  return  (value * this.params.rms_current.multiplier).toFixed(2)
                },
                getOpts: {
                  getOnStart: true 
                },
                endpoint:endpoint
              }) 
    }

    if (this.hasCapability('rms_current_'+endpoint)){ 

              this.registerCapability('rms_current_'+endpoint, CLUSTER.ELECTRICAL_MEASUREMENT, {
                get: 'rmsCurrent',
                report: 'rmsCurrent', 
                reportParser: value => {  
                  
                  if (!this.app_inited) return 0
                  this.log('========report: rms_current-'+endpoint, value, this.params.rms_current.multiplier)
                  return  (value * this.params.rms_current.multiplier).toFixed(2)
                },
                getParser: function(value) {
                  if (!this.app_inited) return 0
                  return  (value * this.params.rms_current.multiplier).toFixed(2)
                },
                getOpts: {
                  getOnStart: true 
                },
                endpoint:endpoint
              }) 
    }  
       
  }


  /**
   * 系统启动，初始化参数
   */
  async _init_app() {

    if (this.params === undefined) {
      this.params = {}
    } 
    if (this.app_inited === undefined){
      this.app_inited = false
    }

    this.log('-------app inited start: ', this.params)
    let inited = true

    await this.unsetWarning();
    
    if (this.hasCapability('meter_power') || this.hasCapability('meter_power_1')){ 
                let meterFactory = 1.0 / 3600000
                try {
                  const {
                    multiplier,
                    divisor,
                  } = await this.zclNode.endpoints[1].clusters[CLUSTER.METERING.NAME].readAttributes(
                    'multiplier', 'divisor')
                  
                  if (multiplier != undefined && divisor != undefined &&
                    multiplier > 0 && divisor > 0) {
                    meterFactory = multiplier / divisor
                    this.params.meter_power = { multiplier : meterFactory, updated : true } 
                  }
                } catch (error) {
                  this.log('------------read meter power params: ', error)
                  this.tipinfo = "Error: Device is not responding, make sure the device has power."
                  inited = false
                } 
    }

    if (this.hasCapability('measure_power') || this.hasCapability('measure_power_1')){  
            let measureFactory = 0.1
            try {
              const {
                acPowerMultiplier,
                acPowerDivisor,
              } = await this.zclNode.endpoints[1].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
                'acPowerMultiplier', 'acPowerDivisor') 
              
              if (acPowerMultiplier != undefined && acPowerDivisor != undefined &&
                acPowerMultiplier > 0 && acPowerDivisor > 0) {
                measureFactory = acPowerMultiplier / acPowerDivisor
                this.params.measure_power = { multiplier : measureFactory, updated : true } 
              }
            } catch (error) {
              this.log('------------read measure_power params: ', error)
              this.tipinfo = "Error: Device is not responding, make sure the device has power."
              inited = false
            } 
    }

    if (this.hasCapability('rms_voltage') || this.hasCapability('rms_voltage_1')){ 
          
              let measureFactory = 0.1
              try {
                const {
                    rmsVoltage,
                  acVoltageMultiplier,
                  acVoltageDivisor,
                } = await this.zclNode.endpoints[1].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
                  'rmsVoltage', 'acVoltageMultiplier', 'acVoltageDivisor')

                  this.log('---------read voltage: ', rmsVoltage, acVoltageMultiplier, acVoltageDivisor)
                
                if (acVoltageMultiplier > 0 && acVoltageDivisor > 0) {
                  measureFactory = acVoltageMultiplier / acVoltageDivisor
                  this.params.rms_voltage = { multiplier : measureFactory, updated : true }
                }  

                if (rmsVoltage != undefined) {
                    
                    if (this.hasCapability('rms_voltage')){
                        this.setCapabilityValue('rms_voltage', ""+(rmsVoltage * this.params.rms_voltage.multiplier).toFixed(1))
                    }
                    if (this.hasCapability('rms_voltage_1')){
                        this.setCapabilityValue('rms_voltage_1', ""+(rmsVoltage * this.params.rms_voltage.multiplier).toFixed(1))
                    }
                    if (this.hasCapability('rms_voltage_2')){
                        this.setCapabilityValue('rms_voltage_2', ""+(rmsVoltage * this.params.rms_voltage.multiplier).toFixed(1))
                    }
                    
                }

              } catch (error) {
                this.log('xxxxxx read rms_voltage params : ', error)
                this.tipinfo = "Error: Device is not responding, make sure the device has power."
                inited = false
              }

    }

    if (this.hasCapability('rms_current') || this.hasCapability('rms_current_1')){ 
        
                let measureFactory = 1 / 1000
                try {
                  const {
                    rmsCurrent,
                    acCurrentMultiplier,
                    acCurrentDivisor,
                  } = await this.zclNode.endpoints[1].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
                    'rmsCurrent', 'acCurrentMultiplier', 'acCurrentDivisor')

                    this.log('---------read current: ', rmsCurrent, acCurrentMultiplier, acCurrentDivisor)
                  
                  if (acCurrentMultiplier > 0 && acCurrentDivisor > 0) {
                    measureFactory = acCurrentMultiplier / acCurrentDivisor
                    this.params.rms_current = { multiplier : measureFactory, updated : true } 
                  }
                  if (rmsCurrent != undefined){
                        if (this.hasCapability('rms_current')){
                            this.setCapabilityValue('rms_current', ""+(rmsCurrent * this.params.rms_current.multiplier).toFixed(2))
                        }
                        if (this.hasCapability('rms_current_1')){
                            this.setCapabilityValue('rms_current_1', ""+(rmsCurrent * this.params.rms_current.multiplier).toFixed(2))
                        }
                        if (this.hasCapability('rms_current_2')){ 
                            this.setCapabilityValue('rms_current_2', ""+(rmsCurrent * this.params.rms_current.multiplier).toFixed(2))
                        }
                  }
                } catch (error) {
                  this.log('xxxxxxx read rms current params: ', error)
                  inited = false
                  this.tipinfo = "Error: Device is not responding, make sure the device has power."
                }
          
    }


    if (inited === false){  

      this.homey.setTimeout( () => {
            this._init_app()
      }, 10000)

      this.log('xxxxxxxxxx init :', this.tipinfo)
      await this.setWarning("Error: Device is not responding, make sure the device has power.");
      //throw new Error("Error: Device is not responding, make sure the device has power.") 
      return  
    }

    this.app_inited = true  
    this.log('-------app inited : ', this.params)

  } //end of init app




}

module.exports = HzcSwitch2GangZigBeeDevice;