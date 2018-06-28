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

const Progress = ({ models, actions }) => {
  const {
    readyProgressBody,
    typeOfScraping,
    currentPage,
    currentUrl,
    authorsRes,
    authorsAllRes,
    numberOfSavedAuthorsOnServer
  } = models;

  const numberOfAuthorsResults = Object.keys(authorsRes.byId).length;
  const numberOfAuthorsAllResults = Object.keys(authorsAllRes.byId).length;
  const {
    nextScraping,
    stopScraping,
    saveAutorsDataToServer,
    filterAuthorsData
  } = actions;

  const progressBody = (
    <div className="progress_body">
      <div className="progress_data">
        <div className="progress_data_title" />
        <div className="progress_data_body">
          <Button
            bsSize="xsmall"
            bsStyle="danger"
            onClick={() => stopScraping()}
          >
            Extra STOP
          </Button>
        </div>
      </div>

      <div className="progress_article_title">Author progress - Stage 1</div>

      <div className="progress_data">
        <div className="progress_data_title">Type Of Scraping</div>
        <div className="progress_data_body">{typeOfScraping}</div>
      </div>

      <div className="progress_data">
        <div className="progress_data_title">currentPage</div>
        <div className="progress_data_body">{currentPage}</div>
      </div>

      <div className="progress_data">
        <div className="progress_data_title">currentUrl</div>
        <div className="progress_data_body">{currentUrl}</div>
      </div>

      <div className="progress_data">
        <div className="progress_data_title">number Of Authors Results</div>
        <div className="progress_data_body">{numberOfAuthorsResults}</div>
      </div>

      <div className="progress_article_title">Stage 2</div>

      <div className="progress_data">
        <div className="progress_data_title">Filter authors data</div>
        <div className="progress_data_body">
          <Button
            bsSize="xsmall"
            bsStyle="success"
            onClick={() => filterAuthorsData(authorsRes.byId)}
          >
            Filter authors data
          </Button>
        </div>
      </div>

      <div className="progress_article_title">Stage 3</div>

      <div className="progress_data">
        <div className="progress_data_title">
          Scrap All authors data (source: authorsRes.byId) (destination:
          authorsAllRes.byId)
        </div>
        <div className="progress_data_body">
          <Button
            bsSize="xsmall"
            bsStyle="success"
            onClick={() => nextScraping(authorsRes.byId)}
          >
            Scrap All authors data
          </Button>
        </div>
      </div>

      <div className="progress_data">
        <div className="progress_data_title">number Of Authors All Results</div>
        <div className="progress_data_body">{numberOfAuthorsAllResults}</div>
      </div>

      <div className="progress_article_title">Stage 4</div>

      <div className="progress_data">
        <div className="progress_data_title">
          Save authors data to server (source: authorsAllRes.byId)
        </div>
        <div className="progress_data_body">
          <Button
            bsSize="xsmall"
            bsStyle="success"
            onClick={() => saveAutorsDataToServer(authorsAllRes.byId)}
          >
            Save data to server
          </Button>
        </div>
      </div>

      <div className="progress_data">
        <div className="progress_data_title">
          number Of Saved Authors on server
        </div>
        <div className="progress_data_body">{numberOfSavedAuthorsOnServer}</div>
      </div>
    </div>
  );

  return (
    <div className="progress_1">
      {!readyProgressBody ? (
        <Spinner className="progress_spinner" size="80px" />
      ) : (
        progressBody
      )}
    </div>
  );
};

const mapStateToProps = ({ progress }) => {
  const {
    readyProgressBody,
    typeOfScraping,
    currentPage,
    currentUrl,
    authorsRes,
    authorsAllRes,
    numberOfSavedAuthorsOnServer
  } = progress;

  return {
    models: {
      readyProgressBody,
      typeOfScraping,
      currentPage,
      currentUrl,
      authorsRes,
      authorsAllRes,
      numberOfSavedAuthorsOnServer
    }
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: {
      nextScraping: byId => A.nextAuthorScraping(byId, dispatch),
      stopScraping: () => dispatch(A.stopScraping()),
      saveAutorsDataToServer: byId => A.saveAutorsDataToServer(byId, dispatch),
      filterAuthorsData: byId => A.filterAuthorsData(byId, dispatch)
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Progress);
