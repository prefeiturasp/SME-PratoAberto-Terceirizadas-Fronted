import PropTypes from "prop-types";
import React, { Component } from "react";
import If from "./layout";
import "./style.scss";

// https://getbootstrap.com/docs/4.0/components/buttons/
export const ButtonStyle = {
  Primary: "primary",
  Secondary: "secondary",
  Success: "success",
  Danger: "danger",
  Warning: "warning",
  Info: "info",
  Light: "light",
  Dark: "dark",
  Link: "link",

  OutlinePrimary: "outline-primary",
  OutlineSecondary: "outline-secondary",
  OutlineSuccess: "outline-success",
  OutlineDanger: "outline-danger",
  OutlineWarning: "outline-warning",
  OutlineInfo: "outline-info",
  OutlineLight: "outline-light",
  OutlineDark: "outline-dark",
  OutlineLink: "outline-link"
};

export const ButtonIcon = {
  TRASH: "trash",
  HOME: "home",
  EDIT: "edit",
  CLOSE: "close",
  FOLDER: "folder",
  POWER_OFF: "power-off"
};

export const ButtonType = {
  SUBMIT: "submit",
  BUTTON: "button",
  RESET: "reset"
};

export default class Button extends Component {
  static propTypes = {
    type: PropTypes.string,
    style: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    type: ButtonType.BUTTON,
    style: ButtonStyle.Link,
    disabled: false
  };

  render() {
    const {
      type,
      style,
      className,
      onClick,
      disabled,
      label,
      title,
      doNotSetSizeProperties,
      noBorder,
      icon
    } = this.props;
    return (
      <button
        type={type}
        title={title}
        className={
          `btn btn-styled btn-${style} ${className} ` +
          (doNotSetSizeProperties ? "" : "set-size-properties ") +
          (noBorder ? "no-border " : "")
        }
        onClick={onClick}
        disabled={disabled}
      >
        <If isVisible={icon}>
          <i className={`pr-3 fas fa-${icon}`} />
        </If>
        {label}
      </button>
    );
  }
}
