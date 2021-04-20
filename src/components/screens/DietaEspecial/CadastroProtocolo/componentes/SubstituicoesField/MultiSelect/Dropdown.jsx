import { Dropdown } from "@khanacademy/react-multi-select";

export default class OurDropdown extends Dropdown {
  handleDocumentClick = event => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.setState({ expanded: false });
      this.props.onUnexpand();
    }
  };

  toggleExpanded = value => {
    const { isLoading } = this.props;
    const { expanded } = this.state;

    if (isLoading) {
      return;
    }

    const newExpanded = value === undefined ? !expanded : !!value;

    this.setState({ expanded: newExpanded });

    if (!newExpanded && this.wrapper) {
      this.wrapper.focus();
      this.props.onUnexpand();
    }
  };
}
