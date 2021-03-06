import classNames from "classnames";
import template from "../../../../../../";
import React from "react";
import uid from "uid";
import PropTypes from "prop-types";
import { Entity } from "draft-js";
import { events } from "formalist-compose";
import createDataObjectRenderer from "formalist-data-object-renderer";
import * as styles from "./styles";

const dataObjectRenderer = createDataObjectRenderer();
let configuredTemplate;

class AtomicBlock extends React.Component {
  static propTypes = {
    block: PropTypes.object.isRequired,
    blockProps: PropTypes.shape({
      editorEmitter: PropTypes.object.isRequired,
      fieldBus: PropTypes.object.isRequired,
      remove: PropTypes.func.isRequired,
      setReadOnly: PropTypes.func.isRequired
    })
  };

  /**
   * Enable parent to pass context
   */

  static contextTypes = {
    globalConfig: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.entityKey = props.block.getEntityAt(0);
    this.entity = Entity.get(this.entityKey);

    // Set a per instance ID for talking to the bus
    this.instanceId = uid();

    this.state = {
      isSelected: false
    };
  }

  componentWillMount() {
    const { fieldBus } = this.props.blockProps;
    document.addEventListener("mouseup", this.handleOutsideMouseClick);
    document.addEventListener("touchstart", this.handleOutsideMouseClick);

    // Atomic blocks are passed the original config and an extra _fieldsConfig
    // key so they can pass any configuration down to children
    const globalConfig = { ...this.context.globalConfig };
    delete globalConfig["_fieldsConfig"];
    // Memoize the configured template the first time this runs
    // We need to invoke this at execution time so that the circular
    // dependencies are properly resolved.
    configuredTemplate =
      configuredTemplate ||
      template(null, {
        global: globalConfig,
        fields: this.context.globalConfig._fieldsConfig
      });

    // Extract the entity
    const entityData = this.entity.getData();

    // Create the formalist form with config
    this.form = configuredTemplate(entityData.form);

    this.form.on("change", getState => {
      const formTemplate = getState();
      Entity.replaceData(this.entityKey, {
        name: entityData.name,
        label: entityData.label,
        form: formTemplate,
        data: dataObjectRenderer(formTemplate)
      });
      // Let the RTE parent component know that the entity data has changed
      editorEmitter.emit("atomic:change");
      this.forceUpdate();
    });

    // Propagate busy/idle states upward
    this.form.on(events.external.FORM_BUSY, () => {
      fieldBus.emit(events.internal.FIELD_BUSY, this.instanceId);
    });
    this.form.on(events.external.FORM_IDLE, () => {
      fieldBus.emit(events.internal.FIELD_IDLE, this.instanceId);
    });

    // Subscribe to the editorEmitter’s onChange event
    const { editorEmitter } = this.props.blockProps;
    editorEmitter.on("change", this.onEditorChange);
    editorEmitter.on("focus", this.checkEditorSelection);
    editorEmitter.on("blur", this.checkEditorSelection);
  }

  componentWillUnmount() {
    const { editorEmitter } = this.props.blockProps;
    editorEmitter.off("change", this.onEditorChange);
    editorEmitter.off("focus", this.checkEditorSelection);
    editorEmitter.off("blur", this.checkEditorSelection);
  }

  onEditorChange = editorState => {
    this.checkEditorSelection(editorState);
  };

  onEditorFocus = editorState => {
    this.checkEditorSelection(editorState);
  };

  checkEditorSelection = editorState => {
    const { editorEmitter } = this.props.blockProps;
    const selection = editorState.getSelection();
    let isSelected = false;
    // Is a collapsed selection at the start?
    if (selection.isCollapsed() && selection.getAnchorOffset() === 0) {
      const { block } = this.props;
      const blockKey = block.getKey();
      const selectedBlockKey = selection.getFocusKey();
      if (blockKey === selectedBlockKey) {
        isSelected = true;
        editorEmitter.emit("atomic:selected", blockKey);
      }
    }
    this.setState({
      isSelected
    });
  };

  onFocus = e => {
    this.setState({
      isSelected: false
    });
    this.setReadOnly(true);
  };

  onBlur = e => {
    this.setReadOnly(false);
  };

  remove = () => {
    const { block, blockProps } = this.props;
    this.setReadOnly(false);
    blockProps.remove(block.getKey());
  };

  setReadOnly = readOnly => {
    const { blockProps } = this.props;
    blockProps.setReadOnly(readOnly);
  };

  render() {
    const { isSelected } = this.state;
    const { label } = this.entity.getData();

    const containerClassNames = classNames(styles.container, {
      [`${styles.containerSelected}`]: isSelected
    });

    // TODO Assess whether to remove this binding
    /* eslint-disable react/jsx-no-bind */
    return (
      <div
        data-atomic
        className={styles.wrapper}
        data-debug-block-key={this.props.block.getKey()}
      >
        <div className={styles.caret}>
          <br />
        </div>
        <div
          ref={r => {
            this._blockContainer = r;
          }}
          className={containerClassNames}
          onClick={this.onFocus}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          contentEditable={false}
        >
          <div className={styles.header}>
            <h3 className={styles.label}>{label}</h3>
            <div className={styles.toolbar}>
              <button
                className={styles.remove}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.remove();
                }}
              >
                <span className={styles.removeText}>Remove</span>
                <div className={styles.removeX}>×</div>
              </button>
            </div>
          </div>
          <div className={styles.content}>{this.form.render()}</div>
        </div>
      </div>
    );
    /* eslint-enable react/jsx-no-bind */
  }
}

export default AtomicBlock;
