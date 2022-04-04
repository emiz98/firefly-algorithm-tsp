var layout = {
  title: {
    text: "TSP Metrics (FA vs BF)",
    font: {
      size: 24,
    },
    xref: "paper",
    x: 0.05,
  },
  xaxis: {
    title: {
      text: "# of iterations",
      font: {
        size: 18,
        color: "#7f7f7f",
      },
    },
  },
  yaxis: {
    title: {
      text: "distance",
      font: {
        size: 18,
        color: "#7f7f7f",
      },
    },
  },
};

function plotGraph() {
  Plotly.newPlot(
    "chart",
    [
      {
        y: [recordDistance],
        type: "line",
        name: "Firefly Algorithm",
        line: { color: "#00FF00" },
      },
      {
        y: [recordDistance1],
        type: "line",
        name: "Brute Force",
        line: { color: "#FF0000" },
      },
    ],
    layout
  );

  var cnt = 0;
  setInterval(function () {
    Plotly.extendTraces(
      "chart",
      { y: [[recordDistance], [recordDistance1]] },
      [0, 1]
    );
    cnt++;
  }, 1);

  //   var cnt = 0;
  //   setInterval(function () {
  //     Plotly.extendTraces(
  //       "chart",
  //       { y: [[recordDistance], [recordDistance1]] },
  //       [0, 1]
  //     );
  //     cnt++;
  //     if (cnt > 100) {
  //       Plotly.relayout("chart", {
  //         xaxis: {
  //           range: [cnt - 100, cnt],
  //         },
  //       });
  //     }
  //   }, 1);
}

var isShowing = false;
function showGraph() {
  isShowing = !isShowing;
  if (isShowing) {
    document.getElementById("chart").style.display = "block";
    document.getElementById("metricsBtn").innerHTML = "Close";
  } else {
    document.getElementById("chart").style.display = "none";
    document.getElementById("metricsBtn").innerHTML = "Metrics";
  }
}

document.onkeydown = function (e) {
  if (e.which == 27) {
    showGraph();
  }
};
