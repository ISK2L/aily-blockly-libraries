// export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
//   {
//     type: "lists_reverse",
//     message0: "%{BKY_LISTS_REVERSE_MESSAGE0}",
//     args0: [
//       {
//         type: "input_value",
//         name: "LIST",
//         check: "Array",
//       },
//     ],
//     output: "Array",
//     inputsInline: true,
//     style: "list_blocks",
//     tooltip: "%{BKY_LISTS_REVERSE_TOOLTIP}",
//     helpUrl: "%{BKY_LISTS_REVERSE_HELPURL}",
//   },
// ]);

// Blockly.common.defineBlocks(blocks);

const MutatorIcon = Blockly.icons.MutatorIcon;

/**
 * Common HSV hue for all blocks in this category.
 */
const HUE = 260;

Blockly.Blocks["lists_create_empty"] = {
  /**
   * Block for creating an empty list.
   * The 'list_create_with' block is preferred as it is more flexible.
   * <block type="lists_create_with">
   *   <mutation items="0"></mutation>
   * </block>
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LISTS_CREATE_EMPTY_TITLE,
      output: "Array",
      colour: HUE,
      tooltip: Blockly.Msg.LISTS_CREATE_EMPTY_TOOLTIP,
      helpUrl: Blockly.Msg.LISTS_CREATE_EMPTY_HELPURL,
    });
  },
};

Blockly.Blocks["init_lists_create_with"] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 []",
      args0: [
        {
          type: "field_dropdown",
          name: "TYPE",
          options: [
            ["整型", "volatile int"],
            ["无符号整数", "volatile unsigned int"],
            ["长整数", "volatile long"],
            ["无符号长整数", "volatile unsigned long"],
            ["小数", "volatile float"],
            ["双精度浮点数", "volatile double"],
            ["布尔", "volatile bool"],
            ["字节", "volatile byte"],
            ["字符", "volatile char"],
            ["无符号字符", "volatile unsigned char"],
            ["字符串", "String"],
            ["uint8_t", "volatile uint8_t"],
            ["uint16_t", "volatile uint16_t"],
            ["uint32_t", "volatile uint32_t"],
            ["uint64_t", "volatile uint64_t"],
            ["int*", "volatile int*"],
            ["unsigned int*", "volatile unsigned int*"],
            ["word*", "volatile word*"],
            ["long*", "volatile long*"],
            ["unsigned long*", "volatile unsigned long*"],
            ["float*", "volatile float*"],
            ["double*", "volatile double*"],
            ["bool*", "volatile bool*"],
            ["byte*", "volatile byte*"],
            ["char*", "volatile char*"],
            ["unsigned char*", "volatile unsigned char*"],
            ["String*", "volatile String*"],
            ["uint8_t*", "volatile uint8_t*"],
            ["uint16_t*", "volatile uint16_t*"],
            ["uint32_t*", "volatile uint32_t*"],
            ["uint64_t*", "volatile uint64_t*"],
          ],
        },
        {
          type: "field_input",
          name: "VAR",
          text: "item",
        },
      ],
    });
    this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
    this.setColour(HUE);
    this.itemCount_ = 3;
    this.updateShape_();
    // this.setOutput(true, "Array");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new MutatorIcon(["lists_create_with_item"], this));
    this.setInputsInline(false);
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    container.setAttribute("items", this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute("items"), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("lists_create_with_container");
    containerBlock.initSvg();
    var connection = containerBlock.getInput("STACK").connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock("lists_create_with_item");
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput("ADD" + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      // MutatorIcon.reconnect(connections[i], this, "ADD" + i);
      connections[i]?.reconnect(this, "ADD" + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    var i = 0;
    while (itemBlock) {
      var input = this.getInput("ADD" + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function () {
    if (this.itemCount_ && this.getInput("EMPTY")) {
      this.removeInput("EMPTY");
    } else if (!this.itemCount_ && !this.getInput("EMPTY")) {
      this.appendDummyInput("EMPTY").appendField(
        Blockly.Msg.LISTS_CREATE_EMPTY_TITLE,
      );
    }
    // Add new inputs.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput("ADD" + i)) {
        var input = this.appendValueInput("ADD" + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH);
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput("ADD" + i)) {
      this.removeInput("ADD" + i);
      i++;
    }
  },
};

Blockly.Blocks["lists_create_with_container"] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function () {
    this.setColour(HUE);
    this.appendDummyInput().appendField(
      Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD,
    );
    this.appendStatementInput("STACK");
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  },
};

Blockly.Blocks["lists_create_with_item"] = {
  /**
   * Mutator bolck for adding items.
   * @this Blockly.Block
   */
  init: function () {
    this.setColour(HUE);
    this.appendDummyInput().appendField(
      Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE,
    );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  },
};

Blockly.Blocks["lists_repeat"] = {
  /**
   * Block for creating a list with one element repeated.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LISTS_REPEAT_TITLE,
      args0: [
        {
          type: "input_value",
          name: "ITEM",
        },
        {
          type: "input_value",
          name: "NUM",
          check: "NUMBER",
        },
      ],
      output: "Array",
      colour: HUE,
      tooltip: Blockly.Msg.LISTS_REPEAT_TOOLTIP,
      helpUrl: Blockly.Msg.LISTS_REPEAT_HELPURL,
    });
  },
};

Blockly.Blocks["lists_length"] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LISTS_LENGTH_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"],
        },
      ],
      output: "Number",
      colour: HUE,
      tooltip: Blockly.Msg.LISTS_LENGTH_TOOLTIP,
      helpUrl: Blockly.Msg.LISTS_LENGTH_HELPURL,
    });
  },
};

Blockly.Blocks["lists_isEmpty"] = {
  /**
   * Block for is the list empty?
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LISTS_ISEMPTY_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"],
        },
      ],
      output: "Boolean",
      colour: HUE,
      tooltip: Blockly.Msg.LISTS_ISEMPTY_TOOLTIP,
      helpUrl: Blockly.Msg.LISTS_ISEMPTY_HELPURL,
    });
  },
};

Blockly.Blocks["lists_indexOf"] = {
  /**
   * Block for finding an item in the list.
   * @this Blockly.Block
   */
  init: function () {
    var OPERATORS = [
      [Blockly.Msg.LISTS_INDEX_OF_FIRST, "FIRST"],
      [Blockly.Msg.LISTS_INDEX_OF_LAST, "LAST"],
    ];
    this.setHelpUrl(Blockly.Msg.LISTS_INDEX_OF_HELPURL);
    this.setColour(HUE);
    this.setOutput(true, "Number");
    this.appendValueInput("VALUE")
      .setCheck("Array")
      .appendField(Blockly.Msg.LISTS_INDEX_OF_INPUT_IN_LIST);
    this.appendValueInput("FIND").appendField(
      new Blockly.FieldDropdown(OPERATORS),
      "END",
    );
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.LISTS_INDEX_OF_TOOLTIP);
  },
};

Blockly.Blocks["lists_getIndex"] = {
  /**
   * Block for getting element at index.
   * @this Blockly.Block
   */
  init: function () {
    var MODE = [
      [Blockly.Msg.LISTS_GET_INDEX_GET, "GET"],
      [Blockly.Msg.LISTS_GET_INDEX_GET_REMOVE, "GET_REMOVE"],
      [Blockly.Msg.LISTS_GET_INDEX_REMOVE, "REMOVE"],
    ];
    this.WHERE_OPTIONS = [
      [Blockly.Msg.LISTS_GET_INDEX_FROM_START, "FROM_START"],
      [Blockly.Msg.LISTS_GET_INDEX_FROM_END, "FROM_END"],
      [Blockly.Msg.LISTS_GET_INDEX_FIRST, "FIRST"],
      [Blockly.Msg.LISTS_GET_INDEX_LAST, "LAST"],
      [Blockly.Msg.LISTS_GET_INDEX_RANDOM, "RANDOM"],
    ];
    this.setHelpUrl(Blockly.Msg.LISTS_GET_INDEX_HELPURL);
    this.setColour(HUE);
    var modeMenu = new Blockly.FieldDropdown(MODE, function (value) {
      var isStatement = value == "REMOVE";
      this.sourceBlock_.updateStatement_(isStatement);
    });
    this.appendValueInput("VALUE")
      .setCheck("Array")
      .appendField(Blockly.Msg.LISTS_GET_INDEX_INPUT_IN_LIST);
    this.appendDummyInput()
      .appendField(modeMenu, "MODE")
      .appendField("", "SPACE");
    this.appendDummyInput("AT");
    if (Blockly.Msg.LISTS_GET_INDEX_TAIL) {
      this.appendDummyInput("TAIL").appendField(
        Blockly.Msg.LISTS_GET_INDEX_TAIL,
      );
    }
    this.setInputsInline(true);
    this.setOutput(true);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var combo =
        thisBlock.getFieldValue("MODE") +
        "_" +
        thisBlock.getFieldValue("WHERE");
      return Blockly.Msg["LISTS_GET_INDEX_TOOLTIP_" + combo];
    });
  },
  /**
   * Create XML to represent whether the block is a statement or a value.
   * Also represent whether there is an 'AT' input.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    var isStatement = !this.outputConnection;
    container.setAttribute("statement", isStatement);
    var isAt = this.getInput("AT").type == Blockly.INPUT_VALUE;
    container.setAttribute("at", isAt);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' input.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    // Note: Until January 2013 this block did not have mutations,
    // so 'statement' defaults to false and 'at' defaults to true.
    var isStatement = xmlElement.getAttribute("statement") == "true";
    this.updateStatement_(isStatement);
    var isAt = xmlElement.getAttribute("at") != "false";
    this.updateAt_(isAt);
  },
  /**
   * Switch between a value block and a statement block.
   * @param {boolean} newStatement True if the block should be a statement.
   *     False if the block should be a value.
   * @private
   * @this Blockly.Block
   */
  updateStatement_: function (newStatement) {
    var oldStatement = !this.outputConnection;
    if (newStatement != oldStatement) {
      this.unplug(true, true);
      if (newStatement) {
        this.setOutput(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      } else {
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setOutput(true);
      }
    }
  },
  /**
   * Create or delete an input for the numeric index.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function (isAt) {
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput("AT");
    this.removeInput("ORDINAL", true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL").appendField(
          Blockly.Msg.ORDINAL_NUMBER_SUFFIX,
        );
      }
    } else {
      this.appendDummyInput("AT");
    }
    var menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function (value) {
      var newAt = value == "FROM_START" || value == "FROM_END";
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt_(newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, "WHERE");
        return null;
      }
      return undefined;
    });
    this.getInput("AT").appendField(menu, "WHERE");
    if (Blockly.Msg.LISTS_GET_INDEX_TAIL) {
      this.moveInputBefore("TAIL", null);
    }
  },
};

Blockly.Blocks["lists_setIndex"] = {
  /**
   * Block for setting the element at index.
   * @this Blockly.Block
   */
  init: function () {
    var MODE = [
      [Blockly.Msg.LISTS_SET_INDEX_SET, "SET"],
      [Blockly.Msg.LISTS_SET_INDEX_INSERT, "INSERT"],
    ];
    this.WHERE_OPTIONS = [
      [Blockly.Msg.LISTS_GET_INDEX_FROM_START, "FROM_START"],
      [Blockly.Msg.LISTS_GET_INDEX_FROM_END, "FROM_END"],
      [Blockly.Msg.LISTS_GET_INDEX_FIRST, "FIRST"],
      [Blockly.Msg.LISTS_GET_INDEX_LAST, "LAST"],
      [Blockly.Msg.LISTS_GET_INDEX_RANDOM, "RANDOM"],
    ];
    this.setHelpUrl(Blockly.Msg.LISTS_SET_INDEX_HELPURL);
    this.setColour(HUE);
    this.appendValueInput("LIST")
      .setCheck("Array")
      .appendField(Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST);
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(MODE), "MODE")
      .appendField("", "SPACE");
    this.appendDummyInput("AT");
    this.appendValueInput("TO").appendField(
      Blockly.Msg.LISTS_SET_INDEX_INPUT_TO,
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LISTS_SET_INDEX_TOOLTIP);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var combo =
        thisBlock.getFieldValue("MODE") +
        "_" +
        thisBlock.getFieldValue("WHERE");
      return Blockly.Msg["LISTS_SET_INDEX_TOOLTIP_" + combo];
    });
  },
  /**
   * Create XML to represent whether there is an 'AT' input.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    var isAt = this.getInput("AT").type == Blockly.INPUT_VALUE;
    container.setAttribute("at", isAt);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' input.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    // Note: Until January 2013 this block did not have mutations,
    // so 'at' defaults to true.
    var isAt = xmlElement.getAttribute("at") != "false";
    this.updateAt_(isAt);
  },
  /**
   * Create or delete an input for the numeric index.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function (isAt) {
    // Destroy old 'AT' and 'ORDINAL' input.
    this.removeInput("AT");
    this.removeInput("ORDINAL", true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL").appendField(
          Blockly.Msg.ORDINAL_NUMBER_SUFFIX,
        );
      }
    } else {
      this.appendDummyInput("AT");
    }
    var menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function (value) {
      var newAt = value == "FROM_START" || value == "FROM_END";
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt_(newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, "WHERE");
        return null;
      }
      return undefined;
    });
    this.moveInputBefore("AT", "TO");
    if (this.getInput("ORDINAL")) {
      this.moveInputBefore("ORDINAL", "TO");
    }

    this.getInput("AT").appendField(menu, "WHERE");
  },
};

Blockly.Blocks["lists_getSublist"] = {
  /**
   * Block for getting sublist.
   * @this Blockly.Block
   */
  init: function () {
    this["WHERE_OPTIONS_1"] = [
      [Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_START, "FROM_START"],
      [Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_END, "FROM_END"],
      [Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST, "FIRST"],
    ];
    this["WHERE_OPTIONS_2"] = [
      [Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START, "FROM_START"],
      [Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END, "FROM_END"],
      [Blockly.Msg.LISTS_GET_SUBLIST_END_LAST, "LAST"],
    ];
    this.setHelpUrl(Blockly.Msg.LISTS_GET_SUBLIST_HELPURL);
    this.setColour(HUE);
    this.appendValueInput("LIST")
      .setCheck("Array")
      .appendField(Blockly.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST);
    this.appendDummyInput("AT1");
    this.appendDummyInput("AT2");
    if (Blockly.Msg.LISTS_GET_SUBLIST_TAIL) {
      this.appendDummyInput("TAIL").appendField(
        Blockly.Msg.LISTS_GET_SUBLIST_TAIL,
      );
    }
    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly.Msg.LISTS_GET_SUBLIST_TOOLTIP);
  },
  /**
   * Create XML to represent whether there are 'AT' inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    var isAt1 = this.getInput("AT1").type == Blockly.INPUT_VALUE;
    container.setAttribute("at1", isAt1);
    var isAt2 = this.getInput("AT2").type == Blockly.INPUT_VALUE;
    container.setAttribute("at2", isAt2);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    var isAt1 = xmlElement.getAttribute("at1") == "true";
    var isAt2 = xmlElement.getAttribute("at2") == "true";
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },
  /**
   * Create or delete an input for a numeric index.
   * This block has two such inputs, independant of each other.
   * @param {number} n Specify first or second input (1 or 2).
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function (n, isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput("AT" + n).setCheck("Number");
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL" + n).appendField(
          Blockly.Msg.ORDINAL_NUMBER_SUFFIX,
        );
      }
    } else {
      this.appendDummyInput("AT" + n);
    }
    var menu = new Blockly.FieldDropdown(this["WHERE_OPTIONS_" + n], function (
      value,
    ) {
      var newAt = value == "FROM_START" || value == "FROM_END";
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt_(n, newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, "WHERE" + n);
        return null;
      }
      return undefined;
    });
    this.getInput("AT" + n).appendField(menu, "WHERE" + n);
    if (n == 1) {
      this.moveInputBefore("AT1", "AT2");
      if (this.getInput("ORDINAL1")) {
        this.moveInputBefore("ORDINAL1", "AT2");
      }
    }
    if (Blockly.Msg.LISTS_GET_SUBLIST_TAIL) {
      this.moveInputBefore("TAIL", null);
    }
  },
};

Blockly.Blocks["lists_sort"] = {
  /**
   * Block for sorting a list.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LISTS_SORT_TITLE,
      args0: [
        {
          type: "field_dropdown",
          name: "TYPE",
          options: [
            [Blockly.Msg.LISTS_SORT_TYPE_NUMERIC, "NUMERIC"],
            [Blockly.Msg.LISTS_SORT_TYPE_TEXT, "TEXT"],
            [Blockly.Msg.LISTS_SORT_TYPE_IGNORECASE, "IGNORE_CASE"],
          ],
        },
        {
          type: "field_dropdown",
          name: "DIRECTION",
          options: [
            [Blockly.Msg.LISTS_SORT_ORDER_ASCENDING, "1"],
            [Blockly.Msg.LISTS_SORT_ORDER_DESCENDING, "-1"],
          ],
        },
        {
          type: "input_value",
          name: "LIST",
          check: "Array",
        },
      ],
      output: "Array",
      colour: HUE,
      tooltip: Blockly.Msg.LISTS_SORT_TOOLTIP,
      helpUrl: Blockly.Msg.LISTS_SORT_HELPURL,
    });
  },
};

Blockly.Blocks["lists_split"] = {
  /**
   * Block for splitting text into a list, or joining a list into text.
   * @this Blockly.Block
   */
  init: function () {
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(
      [
        [Blockly.Msg.LISTS_SPLIT_LIST_FROM_TEXT, "SPLIT"],
        [Blockly.Msg.LISTS_SPLIT_TEXT_FROM_LIST, "JOIN"],
      ],
      function (newMode) {
        thisBlock.updateType_(newMode);
      },
    );
    this.setHelpUrl(Blockly.Msg.LISTS_SPLIT_HELPURL);
    this.setColour(HUE);
    this.appendValueInput("INPUT")
      .setCheck("String")
      .appendField(dropdown, "MODE");
    this.appendValueInput("DELIM")
      .setCheck("String")
      .appendField(Blockly.Msg.LISTS_SPLIT_WITH_DELIMITER);
    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue("MODE");
      if (mode == "SPLIT") {
        return Blockly.Msg.LISTS_SPLIT_TOOLTIP_SPLIT;
      } else if (mode == "JOIN") {
        return Blockly.Msg.LISTS_SPLIT_TOOLTIP_JOIN;
      }
      throw "Unknown mode: " + mode;
    });
  },
  /**
   * Modify this block to have the correct input and output types.
   * @param {string} newMode Either 'SPLIT' or 'JOIN'.
   * @private
   * @this Blockly.Block
   */
  updateType_: function (newMode) {
    if (newMode == "SPLIT") {
      this.outputConnection.setCheck("Array");
      this.getInput("INPUT").setCheck("String");
    } else {
      this.outputConnection.setCheck("String");
      this.getInput("INPUT").setCheck("Array");
    }
  },
  /**
   * Create XML to represent the input and output types.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    container.setAttribute("mode", this.getFieldValue("MODE"));
    return container;
  },
  /**
   * Parse XML to restore the input and output types.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    this.updateType_(xmlElement.getAttribute("mode"));
  },
};
