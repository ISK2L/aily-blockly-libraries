Arduino.forBlock['custom_code'] = function (block, generator) {
    const code = block.getFieldValue('CODE');
    return code + '\n';
};

Arduino.forBlock['custom_macro'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const value = block.getFieldValue('VALUE');
    const code = '#define ' + name + ' ' + value;
    generator.addMacro(name, code);
    return '';
};

Arduino.forBlock['custom_library'] = function (block, generator) {
    const libName = block.getFieldValue('LIB_NAME');
    const code = '#include <' + libName + '>';
    generator.addLibrary(libName, code);
    return '';
};

Arduino.forBlock['custom_variable'] = function (block, generator) {
    const type = block.getFieldValue('TYPE');
    const name = block.getFieldValue('NAME');
    const value = block.getFieldValue('VALUE');
    const code = type + ' ' + name + ' = ' + value + ';';
    generator.addVariable(name, code);
    return '';
};

Arduino.forBlock['custom_function'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const returnType = block.getFieldValue('RETURN');
    const params = block.getFieldValue('PARAMS');
    const body = block.getFieldValue('BODY');

    const code = returnType + ' ' + name + '(' + params + ') {\n' + body + '\n}';
    generator.addFunction(name, code);
    return '';
};

Arduino.forBlock['custom_setup'] = function (block, generator) {
    const setupCode = block.getFieldValue('SETUP_CODE');
    generator.addUserSetup('custom_setup_' + block.id, setupCode);
    return '';
};

Arduino.forBlock['custom_loop'] = function (block, generator) {
    const loopCode = block.getFieldValue('LOOP_CODE');
    generator.addUserLoop('custom_loop_' + block.id, loopCode);
    return '';
};