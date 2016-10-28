//Temperature service class to process temperature

var currentTemperature = 0;
var temperatures = [];

module.exports =  {

    /**
     * process new temperature
     * @param pData
     */
    processNewTemperature : function(pData) {
        //some processing
        var newValue = pData['currentTemperature'];
        temperatures.push(newValue);
    },

    //Returns the average temperature
    getCurrentTemperature : function() {
        var data = temperatures;
        temperatures = [];
        var sum = 0;
        data.forEach(function(element) {
            sum = sum + element;
        });
        if (sum != 0)
            currentTemperature = sum/data.length;
        return currentTemperature;
    }
};
