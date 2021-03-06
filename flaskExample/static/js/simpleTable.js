// Generated by CoffeeScript 1.4.0

/*
  File: simpleTable.coffee
  Author: Davide Griffon

  Simple jQuery plugin to create dynamic ajax tables
  simpleTable is open-sourced via the MIT license.
  See https://github.com/griffosx/simpleTable
*/


(function() {

  (function($) {
    return $.fn.simpleTable = function(options) {
      var addOrderBys, defaults, drawEmptyTable, drawHeader, drawRows, globalWrapper, hideHourglass, initSearchSection, initTable, redrawTable, setOrderBy, settings, showHourglass;
      showHourglass = function() {
        var hourglass, tableWidth;
        tableWidth = $("#" + settings["tableId"]).width();
        hourglass = $("<tr/>").append($("<td/>", {
          colspan: settings["columns"].length,
          style: "padding-left: " + (tableWidth / 2 - 50) + "px!important"
        }).append($("<div/>", {
          "class": "simpleTableHouglass",
          html: settings["textOnWait"]
        })));
        return $("#" + settings["tableId"] + " tbody").append(hourglass);
      };
      hideHourglass = function() {
        return $("#" + settings["tableId"] + " tbody").empty();
      };
      initSearchSection = function() {
        var clearButton, field, fieldSettings, fromRow, key, searchButton, searchForm, searchHtmlTable, searchWrapper, searchable, showSearch, toRow, tr, value, _i, _len, _ref;
        searchable = settings["searchFields"].length > 0;
        showSearch = $("<div/>", {
          "class": "simpleTableShowHideSearchOptions",
          html: settings["textShowHideSearchSection"],
          style: "display: " + (searchable ? "block" : "none")
        });
        searchWrapper = $("<div/>", {
          "class": "simpleTableSearchWrapper",
          style: "display: none"
        });
        searchForm = $("<form/>", {
          onsubmit: "return false"
        });
        searchHtmlTable = $("<table/>");
        showSearch.click(function() {
          return searchWrapper.toggle();
        });
        _ref = settings["searchFields"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fieldSettings = _ref[_i];
          tr = $("<tr/>");
          tr.append($("<td/>", {
            html: "" + fieldSettings["title"] + ":"
          }));
          tr.append($("<td/>", {
            html: fieldSettings["htmlElement"]
          }));
          searchHtmlTable.append(tr);
        }
        for (key in settings["hiddenSearchFields"]) {
          value = settings["hiddenSearchFields"][key];
          field = $("<input/>", {
            name: key,
            type: "hidden",
            value: value
          });
          searchHtmlTable.append(field);
        }
        if (settings["limitResult"]) {
          fromRow = $("<input/>", {
            name: "fromRow",
            type: "text",
            value: ""
          });
          tr = $("<tr/>");
          tr.append($("<td/>", {
            html: settings["textFromRow"]
          }));
          tr.append($("<td/>", {
            html: fromRow.attr("type", "text")
          }));
          searchHtmlTable.append(tr);
          toRow = $("<input/>", {
            name: "toRow",
            type: "text",
            value: ""
          });
          tr = $("<tr/>");
          tr.append($("<td/>", {
            html: settings["textToRow"]
          }));
          tr.append($("<td/>", {
            html: toRow.attr("type", "text")
          }));
          searchHtmlTable.append(tr);
        }
        searchForm.append(searchHtmlTable);
        searchWrapper.append(searchForm);
        searchButton = $("<div/>", {
          html: settings["textSerchButton"],
          "class": "simpleTableButton"
        });
        searchButton.click(redrawTable);
        clearButton = $("<div/>", {
          html: settings["textClearButton"],
          "class": "simpleTableButton",
          style: "margin-left: 7px"
        });
        clearButton.click(function() {
          return globalWrapper.find("input").val("");
        });
        searchWrapper.append(searchButton);
        searchWrapper.append(clearButton);
        globalWrapper.append(showSearch);
        globalWrapper.append(searchWrapper);
        return globalWrapper.append(settings["extraElementBeforeTable"]);
      };
      drawHeader = function() {
        var column, columnDefinition, cssClasses, fieldName, header, isSortable, orderByfield, title, _i, _len, _ref;
        header = $("<tr/>");
        _ref = settings["columns"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          columnDefinition = _ref[_i];
          fieldName = columnDefinition["field"];
          title = columnDefinition["column_title"];
          isSortable = !columnDefinition.hasOwnProperty("sortable") || columnDefinition["sortable"];
          orderByfield = (columnDefinition.hasOwnProperty("orderByField") ? columnDefinition["orderByField"] : fieldName);
          cssClasses = (isSortable ? "columnSortable " : "") + ("col_" + fieldName);
          column = $("<th/>", {
            html: title,
            "class": cssClasses,
            dataOrderBy: orderByfield
          });
          header.append(column);
          if (columnDefinition.hasOwnProperty("defaultOrderBy") && columnDefinition["defaultOrderBy"]) {
            if (columnDefinition.hasOwnProperty("defaultOrderByAscDesc")) {
              setOrderBy(column, columnDefinition["defaultOrderByAscDesc"]);
            } else {
              setOrderBy(column, "asc");
            }
          }
        }
        return $("#" + settings["tableId"] + " thead").append(header);
      };
      setOrderBy = function(column, ascDesc) {
        var newOrderBy;
        if (ascDesc == null) {
          ascDesc = null;
        }
        newOrderBy = column.attr("dataOrderBy");
        $("th.columnSortable").removeClass("asc");
        $("th.columnSortable").removeClass("desc");
        if (ascDesc) {
          if (ascDesc === "asc") {
            settings["orderBy"] = newOrderBy;
            return column.addClass("asc");
          } else {
            settings["orderBy"] = "-" + newOrderBy;
            return column.addClass("desc");
          }
        } else {
          if (settings["orderBy"] === newOrderBy) {
            settings["orderBy"] = "-" + settings["orderBy"];
            return column.addClass("desc");
          } else {
            settings["orderBy"] = newOrderBy;
            return column.addClass("asc");
          }
        }
      };
      addOrderBys = function() {
        return $("th.columnSortable").each(function() {
          return $(this).click(function() {
            setOrderBy($(this));
            return redrawTable();
          });
        });
      };
      initTable = function() {
        var htmlTable;
        htmlTable = $("<table/>", {
          id: settings["tableId"],
          "class": settings["tableCssClass"]
        });
        htmlTable.append($("<thead/>"));
        htmlTable.append($("<tbody/>"));
        htmlTable.css("width", settings["tableWidth"]);
        globalWrapper.append(htmlTable);
        drawHeader();
        return addOrderBys();
      };
      redrawTable = function() {
        var payload, url;
        $("#" + settings["tableId"] + " tbody tr").remove();
        if (settings["resizable"]) {
          $("#" + settings["tableId"]).colResizable({
            disable: true
          });
        }
        url = settings["ajaxUrl"];
        payload = settings["orderBy"] ? "orderBy=" + settings["orderBy"] + "&" : "";
        payload += globalWrapper.find("form").serialize();
        showHourglass();
        return $.ajax({
          url: url,
          dataType: settings["dataType"],
          data: payload,
          timeout: settings["timeout"],
          success: function(data, textStatus, jqXHR) {
            data = settings["dataParser"](data);
            hideHourglass();
            if (data.length === 0) {
              drawEmptyTable(settings["textIfEmpty"]);
            } else {
              drawRows(data);
              if (settings["resizable"]) {
                $("#" + settings["tableId"]).colResizable({
                  hoverCursor: "col-resize",
                  dragCursor: "col-resize"
                });
              }
            }
            return settings["onTableCreated"](data, settings["tableId"]);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            hideHourglass();
            return drawEmptyTable(settings["textOnError"]);
          }
        });
      };
      drawRows = function(rows) {
        var columnDefinition, fieldName, htmlColumn, htmlRow, rendered_field, row, _i, _j, _len, _len1, _ref, _results;
        _results = [];
        for (_i = 0, _len = rows.length; _i < _len; _i++) {
          row = rows[_i];
          htmlRow = $("<tr/>");
          _ref = settings["columns"];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            columnDefinition = _ref[_j];
            fieldName = columnDefinition["field"];
            rendered_field = columnDefinition.hasOwnProperty("renderer") ? columnDefinition["renderer"](row) : row[fieldName];
            htmlColumn = $("<td/>", {
              html: rendered_field,
              "class": "col_" + fieldName
            });
            if (columnDefinition.hasOwnProperty("titleRenderer")) {
              htmlColumn.attr("title", columnDefinition["titleRenderer"](row));
            }
            htmlRow.append(htmlColumn);
          }
          _results.push($("#" + settings["tableId"] + " tbody").append(htmlRow));
        }
        return _results;
      };
      drawEmptyTable = function(text) {
        var htmlRow;
        htmlRow = $("<tr/>");
        htmlRow.append($("<td/>", {
          colspan: settings["columns"].length,
          html: text
        }));
        return $("#" + settings["tableId"] + " tbody").append(htmlRow);
      };
      defaults = {
        dataType: "json",
        timeout: 60000,
        ajaxUrl: "",
        limitResult: false,
        columns: [],
        tableId: "simpleTable_" + ((new Date).getTime()),
        tableWidth: "100%",
        tableCssClass: "simpleTable",
        extraElementBeforeTable: "",
        searchFields: [],
        hiddenSearchFields: {},
        resizable: true,
        dataParser: function(data) {
          return data;
        },
        onTableCreated: function(data, tableId) {},
        textShowHideSearchSection: "Show/hide search options",
        textOnWait: "Wait please",
        textFromRow: "From row:",
        textToRow: "To wor:",
        textSerchButton: "Search",
        textClearButton: "Clear filters",
        textIfEmpty: "Table is empty",
        textOnError: "Error"
      };
      settings = $.extend({}, defaults, options);
      globalWrapper = this;
      return this.each(function() {
        initSearchSection();
        initTable();
        return redrawTable();
      });
    };
  })(jQuery);

}).call(this);
