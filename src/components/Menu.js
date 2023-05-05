export const addNode = (setNodes, setEdges, reactFlowInstance) => {
  if (localStorage.getItem("nodes") !== null) {
    setNodes(JSON.parse(localStorage.getItem("nodes")));
    // console.log(nodes)
  }
  if (localStorage.getItem("edges") !== null) {
    setEdges(JSON.parse(localStorage.getItem("edges")));
  }

  let id = "1";
  let newNode = {};
  // if (nodes.length === 0) {
  if (localStorage.getItem("nodes") === null) {
    newNode = {
      id: "1",
      type: "textUpdater",
      position: { x: 300, y: 100 },
      data: { value: "" },
      style: { backgroundColor: "rgb(223, 249, 255)", border: "1px solid rgb(102, 198, 255)", borderRadius: 24 },
    };
  } else {
    // let newId = parseInt(nodes[nodes.length - 1].id) + 1;
    let newId = parseInt(JSON.parse(localStorage.getItem("nodes")).length) + 1;
    let idActiveNodes = localStorage.getItem("active nodes");
    let activeNode = JSON.parse(localStorage.getItem("nodes")).find((obj) => obj.id === idActiveNodes);
    // console.log(activeNode.position.x)
    // console.log(activeNode.position.y)
    let positionX = 200;
    if (activeNode.position.x < 0) {
      positionX = -200;
    }
    // console.log(newId)
    newNode = {
      id: `${newId}`,
      type: "textUpdater",
      position: { x: activeNode.position.x + positionX, y: activeNode.position.y },
      data: { value: "" },
      style: { backgroundColor: "rgb(223, 249, 255)", border: "1px solid rgb(102, 198, 255)", borderRadius: 24 },
    };
    id = newId;
  }

  reactFlowInstance.addNodes(newNode);
  setNodes((nds) => nds.concat(newNode));
  //   console.log(newNode);
  if (localStorage.getItem("nodes") !== null) {
    const newEdges = {
      id: `${id}`,
      source: localStorage.getItem("active nodes"),
      target: `${id}`,
      style: { stroke: "rgb(0, 162, 255)", strokeWidth: "6" },
      type: "floating",
    };
    setEdges((eds) => eds.concat(newEdges));
    reactFlowInstance.addEdges(newEdges);
  }
};

export const removeAllNodes = () => {
  localStorage.removeItem("nodes");
  localStorage.removeItem("edges");
  localStorage.removeItem("active nodes");
  localStorage.removeItem("dataConvert");
  window.location.reload();
};

export const cekData = (nodes, edges) => {
  console.log("cek", nodes);
  if (localStorage.getItem("temp nodes") !== null) {
    localStorage.setItem("nodes", localStorage.getItem("temp nodes"));
  } else {
    if (nodes.length !== 0) {
      localStorage.setItem("nodes", JSON.stringify(nodes));
    } else if (nodes.length === 0 && localStorage.getItem("nodes") !== null) {
      if (localStorage.getItem("nodes") === null || JSON.parse(localStorage.getItem("nodes")).length === 1) {
        localStorage.removeItem("nodes");
      }
    }
  }

  if (localStorage.getItem("temp edges") !== null) {
    localStorage.setItem("edges", localStorage.getItem("temp edges"));
  } else {
    if (edges.length !== 0) {
      localStorage.setItem("edges", JSON.stringify(edges));
      // console.log(edges);
    } else if (edges.length === 0 && localStorage.getItem("edges") !== null) {
      if (localStorage.getItem("edges") === null || JSON.parse(localStorage.getItem("edges")).length === 0) {
        localStorage.removeItem("edges");
      }
    }
  }
};
