
const preparePage = function(req, res, title) {
  const page = {
    title: title,
    user: req.user,
    url: req.url,
    data: [],
    menu: [
      { link: "/", name: "Tableau de bord" },
      { link: "/logs", name: "Logs" },
      { link: "/users", name: "Utilisateurs" },
      { link: "/ingredients", name: "Ingredients" },
      { link: "/picard", name: "Picard" }
    ]
  };

  page.render = function() {
    res.render("admin/index", page);
  };
  
  page.renderTable = function(name, headers, data) {
    this.data.push({
      type: 'table',
      name: name,
      headers: headers,
      data: data,
    })
    
    return this;
  };
  
  page.renderActions = function(name, actions) {
    this.data.push({
      type: 'actions',
      name: name,
      actions: actions,
    })
    
    return this;
  };

  return page;
};

const renderPage = {
  prepare: function(title) {}
};

module.exports = {preparePage: preparePage};