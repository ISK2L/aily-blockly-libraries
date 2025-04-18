Arduino.forBlock['sht3x_init'] = function (block, generator) {
    generator.addLibrary('#include <SHT3x.h>', '#include <SHT3x.h>');
    generator.addVariable('SHT3x sensor', 'SHT3x sensor;');
    return 'sensor.begin();\n';
};

Arduino.forBlock['sht3x_read_temperature'] = function (block, generator) {
    generator.addLibrary('#include <SHT3x.h>', '#include <SHT3x.h>');
    generator.addVariable('SHT3x sensor', 'SHT3x sensor;');
    return ['sensor.getTemperature()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['sht3x_read_humidity'] = function (block, generator) {
    generator.addLibrary('#include <SHT3x.h>', '#include <SHT3x.h>');
    generator.addVariable('SHT3x sensor', 'SHT3x sensor;');
    return ['sensor.getHumidity()', Arduino.ORDER_FUNCTION_CALL];
};