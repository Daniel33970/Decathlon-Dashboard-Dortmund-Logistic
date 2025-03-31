import React from "react";
import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";

export const QuarterCircleMenu = () => {
  const items = [
    {
      className: "view", // 1. Eigene Klasse für den Tooltip
      icon: "pi pi-eye",
      onClick: () => window.open("https://view.dktapp.cloud/actions/myhome", "_blank"),
    },
    {
      className: "tattoo", // 2. Eigene Klasse für den Tooltip
      icon: "pi pi-truck",
      onClick: () => window.open("https://tattoo.dktapp.cloud/tattoo/", "_blank"),
    },
    {
      className: "verladeplan", // 3. Eigene Klasse für den Tooltip
      icon: "pi pi-calendar-clock",
      onClick: () => window.open("https://docs.google.com/spreadsheets/d/1cFRVXdidLgZ_R1kkkWZKRf1QgfpQO8XNbGfCsJdIxK4/edit#gid=0", "_blank"),
    },
    {
      className: "transportplan", // 3. Eigene Klasse für den Tooltip
      icon: "pi pi-compass",
      onClick: () => window.open("https://docs.google.com/spreadsheets/d/1P9leKjVlNYc_WmDRM3isaH_3VuNmoKfvzfy5QKoDM90/edit#gid=1095576528", "_blank"),
    },
    {
      className: "flows", // 3. Eigene Klasse für den Tooltip
      icon: "pi pi-sync",
      onClick: () => window.open("https://docs.google.com/spreadsheets/d/1toNnaS2Hgm5I2y3WtVkYsfJT7DPg1LVD7K9HrumqZNM/edit#gid=467715948", "_blank"),
    },
    {
      className: "skydec", // 3. Eigene Klasse für den Tooltip
      icon: "pi pi-compass",
      onClick: () => window.open("https://script.google.com/a/decathlon.com/macros/s/AKfycbyUba5OSgmqL61isFXcvcUR8qD1URilDt_d891fsbYofZ3RTn0_rH7b-cWpAOdnyxLs/exec?page=Index", "_blank"),
    },
    {
      className: "warehousebox", // 3. Eigene Klasse für den Tooltip
      icon: "pi pi-box",
      onClick: () => window.open("https://whbox-pickingwavebox-eu.dktapp.cloud/W122/?date=2023-02-22&page=1&size=15", "_blank"),
    },
  ];

  return (
    <>
      {/* SpeedDial-Menü */}
      <SpeedDial
        model={items}
        type="linear"
        direction="up"
        showIcon="pi pi-plus"
        hideIcon="pi pi-times"
        showLabel={false}
        style={{ position: "fixed", bottom: 30, right: 30 }}
      />

      {/* Tooltips – jeder Tooltip ist an .speeddial-XXX gebunden */}
      <Tooltip target=".view" content="VIEW" position="left" />
      <Tooltip target=".tattoo" content="TATTOO" position="left" />
      <Tooltip target=".verladeplan" content="VERLADEPLAN" position="left" />
      <Tooltip target=".transportplan" content="TRANSPORTPLAN" position="left" />
      <Tooltip target=".flows" content="FLOWs" position="left" />
      <Tooltip target=".skydec" content="SKYDEC" position="left" />
      <Tooltip target=".warehousebox" content="WAREHOUSEBOX" position="left" />
    </>
  );
};
