import React from "react";
import MultiSelect from "@khanacademy/react-multi-select";

import Dropdown from "./Dropdown";
import SelectPanel from "@khanacademy/react-multi-select/dist/select-panel";
//import SelectPanel from './select-panel.js';

export default class StatefulMultiSelect extends MultiSelect {
  render() {
    const {
      ItemRenderer,
      options,
      selected,
      selectAllLabel,
      isLoading,
      disabled,
      disableSearch,
      filterOptions,
      shouldToggleOnHover,
      hasSelectAll,
      overrideStrings,
      labelledBy,
      onUnexpand
    } = this.props;

    return (
      <div className="multi-select">
        <Dropdown
          isLoading={isLoading}
          contentComponent={SelectPanel}
          shouldToggleOnHover={shouldToggleOnHover}
          contentProps={{
            ItemRenderer,
            options,
            selected,
            hasSelectAll,
            selectAllLabel,
            onSelectedChanged: this.handleSelectedChanged,
            disabled,
            disableSearch,
            filterOptions,
            overrideStrings
          }}
          disabled={disabled}
          labelledBy={labelledBy}
          onUnexpand={onUnexpand}
        >
          {this.renderHeader()}
        </Dropdown>
      </div>
    );
  }
}
