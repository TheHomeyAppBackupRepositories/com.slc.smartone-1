const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER } = require("zigbee-clusters");
const HzcSwitch2GangZigBeeDevice = require('../../lib/HzcSwitch2GangZigBeeDevice')
const HzcDimmerZigBeeDevice = require('../../lib/HzcDimmerZigBeeDevice')

class S24029Device extends HzcDimmerZigBeeDevice {
    async onNodeInit({ zclNode }) {

        this.log('++++ init...')

        this.app_inited = false
        this.params = {}

        if (!this.hasCapability('onoff')) {
            await this.addCapability('onoff'); 
        }
        if (!this.hasCapability('dim')){
            await this.addCapability('dim'); 
        }  

        if (!this.hasCapability('measure_power')) {
            await this.addCapability('measure_power')
        }

        if (this.hasCapability('meter_power')) {
            await this.removeCapability('meter_power')
        } 

        //way 2
        this.registerSwitchOnoff()
        this.registerDim() 
        this.registerMeterPowerMeasurePower(1)
        this._init_app()

    }
}

module.exports = S24029Device;