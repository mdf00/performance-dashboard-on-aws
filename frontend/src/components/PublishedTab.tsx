import React, { useState } from "react";
import { Dashboard, DashboardState } from "../models";
import Button from "./Button";
import Search from "./Search";
import DashboardsTable from "./DashboardsTable";
import ScrollTop from "./ScrollTop";
import Link from "./Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

interface Props {
  dashboards: Array<Dashboard>;
  onArchive: Function;
}

function PublishedTab(props: Props) {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Array<Dashboard>>([]);

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = (selectedDashboards: Array<Dashboard>) => {
    setSelected(selectedDashboards);
  };

  const filterDashboards = (dashboards: Array<Dashboard>): Array<Dashboard> => {
    return dashboards.filter((dashboard) => {
      const name = dashboard.name.toLowerCase().trim();
      const topicAreaName = dashboard.topicAreaName.toLowerCase().trim();
      const createdBy = dashboard.createdBy.toLowerCase().trim();
      const query = filter.toLowerCase();
      return (
        name.includes(query) ||
        topicAreaName.includes(query) ||
        createdBy.includes(query)
      );
    });
  };

  const sortDashboards = (dashboards: Array<Dashboard>): Array<Dashboard> => {
    return [...dashboards].sort((a, b) => {
      return a.updatedAt > b.updatedAt ? -1 : 1;
    });
  };

  return (
    <div>
      <p>
        These are all of the published dashboards. You can view all dashboards
        but you need editor access in order to update a published dashboard.{" "}
        <Link target="_blank" to={"/"}>
          View the published site
          <FontAwesomeIcon
            className="margin-left-05"
            icon={faExternalLinkAlt}
            size="xs"
          />
        </Link>
      </p>
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-7 text-left padding-top-1px">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span>
                <Search id="search" onSubmit={onSearch} size="small" />
              </span>
            </li>
          </ul>
        </div>
        <div className="tablet:grid-col-5 text-right">
          <span>
            <Button
              variant="outline"
              disabled={selected.length === 0}
              onClick={() => props.onArchive(selected)}
            >
              Archive
            </Button>
          </span>
        </div>
      </div>
      <DashboardsTable
        dashboards={sortDashboards(filterDashboards(props.dashboards))}
        dashboardsState={DashboardState.Published}
        onSelect={onSelect}
      />
      <div className="text-right">
        <ScrollTop />
      </div>
    </div>
  );
}

export default PublishedTab;
