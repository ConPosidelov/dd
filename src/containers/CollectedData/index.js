import React from "react";
import { connect } from "react-redux";
import A from "../../actions";

import {
  Grid,
  Row,
  Col,
  MenuItem,
  Button,
  SplitButton,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";

import Spinner from "react-md-spinner";
import ReactTable from "react-table";

class CollectedData extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      openSourceMenu: false
    };
  }

  menuHandler = () => {
    const { openSourceMenu } = this.state;
    this.setState({ openSourceMenu: !openSourceMenu });
  };

  render() {
    const { models, actions } = this.props;
    const {
      readyCollectedData,
      dataSource,
      current,
      sample,
      sourseMenu,
      authorsAllFromServerStatus
    } = models;

    const { selectDataSourse, deleteDataSourse } = actions;
    const { openSourceMenu } = this.state;

    const menu = Object.keys(sourseMenu).map(id => {
      const name = sourseMenu[id];
      return (
        <div key={id} className="sourse_menu_item">
          <div
            className="sourse_menu_body"
            onClick={() => selectDataSourse(id, name)}
          >
            {name}
          </div>
          <div
            className="sourse_menu_close"
            onClick={() => deleteDataSourse(id)}
          >
            x
          </div>
        </div>
      );
    });

    const collectedDataBody = (
      <div className="collected_data_body">
        <div className="collected_data_controls">
          <div className="collected_data_sourse_title">{dataSource}</div>

          <div className="collected_data_sourse_btn">
            <Button bsSize="small" onClick={() => this.menuHandler()}>
              Source menu
            </Button>
          </div>
        </div>

        <div
          className={
            !openSourceMenu
              ? "collected_data_sourse_menu"
              : "collected_data_sourse_menu open"
          }
        >
          {menu}
        </div>

        <div className="collected_data_tabs">
          <ReactTable
            pageSizeOptions={[5, 10, 20, 30]}
            defaultPageSize={10}
            data={current.data}
            columns={current.columns}
          />
        </div>
      </div>
    );

    return (
      <div className="collected_data">
        {!readyCollectedData ? (
          <Spinner className="progress_spinner" size="80px" />
        ) : (
          collectedDataBody
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ collectedData, progress }) => {
  const {
    readyCollectedData,
    dataSource,
    current,
    sample,
    sourseMenu
  } = collectedData;

  const authorsAllFromServerStatus = progress.authorsAllFromServer.status;

  return {
    models: {
      readyCollectedData,
      dataSource,
      sourseMenu,
      current,
      sample,
      authorsAllFromServerStatus
    }
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: {
      selectDataSourse: (id, name) => {
        A.selectDataSourse(id, name, dispatch);
      },
      deleteDataSourse: id => A.deleteCollectedThemesByKey(id, dispatch)
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectedData);
