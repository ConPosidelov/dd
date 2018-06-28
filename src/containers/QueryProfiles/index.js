import React from "react";
import { connect } from "react-redux";
import A from "../../actions";

import {
  Grid,
  Row,
  Col,
  Panel,
  Button,
  Table,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";
import Spinner from "react-md-spinner";
import FormCreateNewProfile from "../QueryProfilesForm";

const tooltip = text => {
  return <Tooltip>{text}</Tooltip>;
};

const QueryProfiles = ({ models, actions }) => {
  const {
    byId,
    allIds,
    newProfileStatus,
    getAllProfilesStatus,
    forceUpdate,
    runningProfileId
  } = models;

  const {
    createNewQueryProfile,
    getCollectedData,
    startScraping,
    removeQueresProfile
  } = actions;

  const numOfProfiles = allIds.length;
  const allProfiles = Object.keys(byId).map((item, i) => {
    const {
      _id,
      created,
      name,
      description,
      type,
      url,
      pageStart,
      pageOffset,
      itemLimit,
      minSales,
      minRank,
      results,
      loadData
    } = byId[item];

    let runBtnTitle = (
      <Button
        bsSize="xsmall"
        bsStyle="success"
        onClick={() => startScraping(byId[_id])}
      >
        Run
      </Button>
    );

    if (results.length) runBtnTitle = "";

    const running = runningProfileId === _id;
    if (running)
      runBtnTitle = (
        <div className="run_spinner">
          <Spinner />
        </div>
      );

    return (
      <div key={i} className="query_panel_body_row">
        <div className="query_cell">{i + 1}</div>

        <div className="query_cell">
          <div className="query_row_name">{name}</div>
          <div className="query_row_name">
            <Button
              bsSize="xsmall"
              bsStyle="success"
              onClick={() => getCollectedData(_id, name, type)}
              disabled={!results.length || loadData ? true : false}
            >
              Load
            </Button>
            {runBtnTitle}
          </div>
        </div>
        <div className="query_cell">
          <a href={url}>{url}</a>
        </div>
        <div className="query_cell">{created ? created : "New"}</div>
        <div className="query_cell">{`${minSales} / ${minRank}`}</div>

        <OverlayTrigger placement="left" overlay={tooltip(description)}>
          <div className="query_cell">{description}</div>
        </OverlayTrigger>

        <div className="query_cell">
          {results.length ? results.length : "New"}
        </div>
        <div className="query_cell">
          <Button
            bsSize="xsmall"
            bsStyle="danger"
            onClick={() => removeQueresProfile(_id, forceUpdate, results)}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  });

  let newFormMsg = "";
  if (newProfileStatus === "fetching") newFormMsg = <Spinner />;
  if (newProfileStatus === "fetchFailed") newFormMsg = "Resive data Failed!";

  const profileBody = (
    <div>
      <Row className="title">
        <Col md={6} xs={6}>
          <div className="query_profiles_msg">{newFormMsg}</div>
        </Col>
        <Col md={6} xs={6}>
          <Button
            bsSize="small"
            bsStyle="primary"
            onClick={() => createNewQueryProfile()}
          >
            Add New
          </Button>
        </Col>
      </Row>
      {newProfileStatus === "create" ? <FormCreateNewProfile /> : ""}

      <Row
        className={
          newProfileStatus !== "create" ? "query_panel" : "query_panel hide"
        }
      >
        <Col md={12} xs={12}>
          <Panel>
            <Panel.Heading>
              <div className="query_panel_title">
                <div className="title_cell">#</div>
                <div className="title_cell">Title</div>
                <div className="title_cell">Url</div>
                <div className="title_cell">Date</div>
                <div className="query_title_params">minSales/minRank</div>
                <div className="title_cell">Description</div>
                <div className="title_cell">Result</div>
                <div className="title_cell">Remove</div>
              </div>
            </Panel.Heading>
            <Panel.Body>{allProfiles}</Panel.Body>
          </Panel>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="query_profiles">
      {getAllProfilesStatus !== "fetched" ? (
        <Spinner className="query_profiles_spinner" size="80px" />
      ) : (
        profileBody
      )}
    </div>
  );
};

const mapStateToProps = ({ queryProfiles }) => {
  const {
    byId,
    allIds,
    newProfileStatus,
    getAllProfilesStatus,
    forceUpdate,
    runningProfileId
  } = queryProfiles;
  return {
    models: {
      byId,
      allIds,
      newProfileStatus,
      getAllProfilesStatus,
      forceUpdate,
      runningProfileId
    }
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: {
      removeQueresProfile: (id, forceUpdate, results) =>
        A.removeQueresProfile(id, forceUpdate, results, dispatch),
      createNewQueryProfile: () => dispatch(A.manageNewQueryProfile("create")),
      startScraping: profile => A.startScraping(profile, dispatch),
      getCollectedData: (id, name, type) =>
        A.getCollectedData(id, name, type, dispatch)
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryProfiles);
