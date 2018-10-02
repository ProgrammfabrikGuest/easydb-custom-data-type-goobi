// Generated by CoffeeScript 1.10.0
var CustomDataTypeGoobi,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

CustomDataTypeGoobi = (function(superClass) {
  extend(CustomDataTypeGoobi, superClass);

  function CustomDataTypeGoobi() {
    return CustomDataTypeGoobi.__super__.constructor.apply(this, arguments);
  }

  CustomDataTypeGoobi.prototype.getL10NPrefix = function() {
    return "custom.data.type.goobi";
  };

  CustomDataTypeGoobi.prototype.getCustomDataTypeName = function() {
    return "custom:base.custom-data-type-goobi.goobi";
  };

  CustomDataTypeGoobi.prototype.getCustomDataTypeNameLocalized = function() {
    return $$("custom.data.type.goobi.name");
  };

  CustomDataTypeGoobi.prototype.getFrontendLanguage = function() {
    var desiredLanguage;
    desiredLanguage = ez5.loca.getLanguage();
    desiredLanguage = desiredLanguage.split('-');
    desiredLanguage = desiredLanguage[0];
    return desiredLanguage;
  };

  CustomDataTypeGoobi.prototype.__getAdditionalTooltipInfo = function(uri, tooltip, extendedInfo_xhr) {
    var encodedURI, goobi_endpoint_token, goobi_projects, ref, ref1, ref2, ref3, ref4, ref5, that, url;
    that = this;
    encodedURI = encodeURIComponent(uri);
    if (extendedInfo_xhr.xhr !== void 0) {
      extendedInfo_xhr.xhr.abort();
    }
    goobi_endpoint_token = ((ref = that.getCustomMaskSettings().goobi_endpoint_token) != null ? ref.value : void 0) ? (ref1 = that.getCustomMaskSettings().goobi_endpoint_token) != null ? ref1.value : void 0 : '';
    goobi_endpoint_token = encodeURIComponent(goobi_endpoint_token);
    goobi_projects = ((ref2 = that.getCustomMaskSettings().projects) != null ? ref2.value : void 0) ? (ref3 = that.getCustomMaskSettings().projects) != null ? ref3.value : void 0 : '';
    goobi_projects = encodeURIComponent(goobi_projects);
    url = 'https://goobi.prizepapers.gbv.de/goobi/api/processes/search?token=' + goobi_endpoint_token + '&field=' + ((ref4 = that.getCustomSchemaSettings().safeAsConceptURI) != null ? ref4.value : void 0) + '&offset=0&orderby=' + ((ref5 = that.getCustomSchemaSettings().safeAsConceptURI) != null ? ref5.value : void 0) + '&descending=true&value=' + encodedURI + '&limit=1&filterProjects=' + goobi_projects;
    url = location.protocol + '//jsontojsonp.gbv.de/?url=' + encodeURIComponent(url);
    extendedInfo_xhr.xhr = new CUI.XHR({
      url: url
    });
    extendedInfo_xhr.xhr.start().done(function(data, status, statusText) {
      var entry, htmlContent, i, j, key, key2, label, len, len1, metadata, metadatas, ref6, ref7, ref8, ref9, valuePairs;
      htmlContent = '<span style="font-weight: bold; padding: 3px 6px;">' + $$('custom.data.type.goobi.config.parameter.mask.infopopup.popup.info') + '</span>';
      htmlContent += '<table style="border-spacing: 10px; border-collapse: separate;">';
      if (data != null ? (ref6 = data[0]) != null ? ref6.metadata : void 0 : void 0) {
        metadatas = data != null ? (ref7 = data[0]) != null ? ref7.metadata : void 0 : void 0;
        valuePairs = {};
        for (key in metadatas) {
          metadata = metadatas[key];
          for (key2 = i = 0, len = metadata.length; i < len; key2 = ++i) {
            entry = metadata[key2];
            if ((ref8 = entry.labels) != null ? ref8[that.getFrontendLanguage()] : void 0) {
              label = (ref9 = entry.labels) != null ? ref9[that.getFrontendLanguage()] : void 0;
            } else {
              label = entry.labels[Object.keys(entry.labels)[0]];
            }
            if (!valuePairs[label]) {
              valuePairs[label] = [];
            }
            valuePairs[label].push(entry['value']);
          }
        }
        for (key in valuePairs) {
          metadata = valuePairs[key];
          htmlContent += '<tr><td style="min-width:150px;"><b>' + key + ':</b></td><td>';
          for (key2 = j = 0, len1 = metadata.length; j < len1; key2 = ++j) {
            entry = metadata[key2];
            htmlContent += entry;
          }
          htmlContent += '</td></tr>';
        }
        htmlContent += '</table>';
      }
      tooltip.DOM.innerHTML = htmlContent;
      return tooltip.autoSize();
    });
  };

  CustomDataTypeGoobi.prototype.__updateSuggestionsMenu = function(cdata, cdata_form, searchstring, input, suggest_Menu, searchsuggest_xhr, layout) {
    var delayMillisseconds, that;
    that = this;
    delayMillisseconds = 200;
    return setTimeout((function() {
      var apiUrl, goobi_countSuggestions, goobi_endpoint_token, goobi_projects, goobi_searchfield, goobi_searchterm, ref, ref1, ref2, ref3, ref4, url;
      goobi_searchterm = searchstring;
      goobi_countSuggestions = 20;
      goobi_searchfield = (ref = that.getCustomMaskSettings().searchfields) != null ? ref.value.split(',').shift() : void 0;
      if (cdata_form) {
        goobi_searchterm = cdata_form.getFieldsByName("searchbarInput")[0].getValue();
        goobi_countSuggestions = cdata_form.getFieldsByName("countOfSuggestions")[0].getValue();
        goobi_searchfield = cdata_form.getFieldsByName("searchfieldSelect")[0].getValue();
      }
      if (goobi_searchterm.length === 0) {
        return;
      }
      if (searchsuggest_xhr.xhr !== void 0) {
        searchsuggest_xhr.xhr.abort();
      }
      goobi_endpoint_token = ((ref1 = that.getCustomMaskSettings().goobi_endpoint_token) != null ? ref1.value : void 0) ? (ref2 = that.getCustomMaskSettings().goobi_endpoint_token) != null ? ref2.value : void 0 : '';
      goobi_endpoint_token = encodeURIComponent(goobi_endpoint_token);
      goobi_projects = ((ref3 = that.getCustomMaskSettings().projects) != null ? ref3.value : void 0) ? (ref4 = that.getCustomMaskSettings().projects) != null ? ref4.value : void 0 : '';
      goobi_projects = encodeURIComponent(goobi_projects);
      apiUrl = 'https://goobi.prizepapers.gbv.de/goobi/api/processes/search?token=' + goobi_endpoint_token + '&field=' + goobi_searchfield + '&value=' + goobi_searchterm + '&limit=' + goobi_countSuggestions + '&offset=0&orderby=' + goobi_searchfield + '&descending=true&filterProjects=' + goobi_projects;
      url = location.protocol + '//jsontojsonp.gbv.de/?url=' + encodeURIComponent(apiUrl);
      searchsuggest_xhr.xhr = new CUI.XHR({
        url: url
      });
      return searchsuggest_xhr.xhr.start().done(function(data, status, statusText) {
        var conceptNameCandidate, conceptURICandidate, extendedInfo_xhr, i, itemList, key, len, menu_items, ref5, ref6, safeAsConceptName, safeAsConceptURI, suggestion;
        extendedInfo_xhr = {
          "xhr": void 0
        };
        menu_items = [];
        for (key = i = 0, len = data.length; i < len; key = ++i) {
          suggestion = data[key];
          suggestion = suggestion.metadata;
          if (suggestion != null ? suggestion.identifier_doi : void 0) {
            safeAsConceptName = (ref5 = that.getCustomSchemaSettings().safeAsConceptName) != null ? ref5.value : void 0;
            safeAsConceptURI = (ref6 = that.getCustomSchemaSettings().safeAsConceptURI) != null ? ref6.value : void 0;
            conceptNameCandidate = (suggestion != null ? suggestion[safeAsConceptName] : void 0) ? suggestion != null ? suggestion[safeAsConceptName][0].value : void 0 : '';
            conceptURICandidate = (suggestion != null ? suggestion[safeAsConceptURI] : void 0) ? suggestion != null ? suggestion[safeAsConceptURI][0].value : void 0 : '';
            if (conceptNameCandidate !== '' && conceptURICandidate !== '') {
              (function(key) {
                var item;
                item = {
                  text: conceptNameCandidate,
                  value: conceptURICandidate,
                  tooltip: {
                    markdown: true,
                    placement: "nw",
                    content: function(tooltip) {
                      that.__getAdditionalTooltipInfo(conceptURICandidate, tooltip, extendedInfo_xhr);
                      return new CUI.Label({
                        icon: "spinner",
                        text: $$('custom.data.type.goobi.config.parameter.mask.show_infopopup.loading.label')
                      });
                    }
                  }
                };
                return menu_items.push(item);
              })(key);
            }
          }
        }
        itemList = {
          onClick: function(ev2, btn) {
            cdata.conceptURI = btn.getOpt("value");
            cdata.conceptName = btn.getText();
            that.__updateResult(cdata, layout);
            suggest_Menu.hide();
            if (that.popover) {
              return that.popover.hide();
            }
          },
          items: menu_items
        };
        if (itemList.items.length === 0) {
          itemList = {
            items: [
              {
                text: "kein Treffer",
                value: void 0
              }
            ]
          };
        }
        suggest_Menu.setItemList(itemList);
        return suggest_Menu.show();
      });
    }), delayMillisseconds);
  };

  CustomDataTypeGoobi.prototype.__getEditorFields = function(cdata) {
    var fields, i, key, len, option, ref, searchOptions, searchfield, searchfields;
    searchOptions = [];
    searchfields = (ref = this.getCustomMaskSettings().searchfields) != null ? ref.value.split(',') : void 0;
    for (key = i = 0, len = searchfields.length; i < len; key = ++i) {
      searchfield = searchfields[key];
      option = {
        value: searchfield,
        text: $$('custom.data.type.goobi.modal.form.text.searchfield.' + searchfield)
      };
      searchOptions.push(option);
    }
    fields = [
      {
        type: CUI.Select,
        "class": "commonPlugin_Select",
        undo_and_changed_support: false,
        form: {
          label: $$('custom.data.type.goobi.modal.form.text.count')
        },
        options: [
          {
            value: 10,
            text: '10 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          }, {
            value: 20,
            text: '20 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          }, {
            value: 50,
            text: '50 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          }, {
            value: 100,
            text: '100 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          }, {
            value: 500,
            text: '500 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          }
        ],
        name: 'countOfSuggestions'
      }, {
        type: CUI.Select,
        "class": "commonPlugin_Select",
        undo_and_changed_support: false,
        form: {
          label: $$('custom.data.type.goobi.modal.form.text.searchfield')
        },
        options: searchOptions,
        name: 'searchfieldSelect'
      }, {
        type: CUI.Input,
        "class": "commonPlugin_Input",
        undo_and_changed_support: false,
        form: {
          label: $$("custom.data.type.goobi.modal.form.text.searchbar")
        },
        placeholder: $$("custom.data.type.goobi.modal.form.text.searchbar.placeholder"),
        name: "searchbarInput"
      }
    ];
    return fields;
  };

  CustomDataTypeGoobi.prototype.__renderButtonByData = function(cdata) {
    var extendedInfo_xhr, that;
    that = this;
    switch (this.getDataStatus(cdata)) {
      case "empty":
        return new CUI.EmptyLabel({
          text: $$("custom.data.type.goobi.edit.no_goobi")
        }).DOM;
      case "invalid":
        return new CUI.EmptyLabel({
          text: $$("custom.data.type.goobi.edit.no_valid_goobi")
        }).DOM;
    }
    extendedInfo_xhr = {
      "xhr": void 0
    };
    cdata.conceptURI = CUI.parseLocation(cdata.conceptURI).url;
    return new CUI.HorizontalLayout({
      maximize: true,
      left: {
        content: new CUI.Label({
          centered: true,
          text: cdata.conceptName
        })
      },
      center: {
        content: new CUI.Button({
          appearance: "link",
          icon_left: new CUI.Icon({
            "class": "fa-info-circle"
          }),
          tooltip: {
            markdown: true,
            placement: 'n',
            content: function(tooltip) {
              var uri;
              uri = cdata.conceptURI;
              that.__getAdditionalTooltipInfo(uri, tooltip, extendedInfo_xhr);
              return new CUI.Label({
                icon: "spinner",
                text: $$('custom.data.type.dante.modal.form.popup.loadingstring')
              });
            }
          },
          text: ""
        })
      },
      right: null
    }).DOM;
  };

  CustomDataTypeGoobi.prototype.getCustomDataOptionsInDatamodelInfo = function(custom_settings) {
    var ref, tags;
    console.log(custom_settings);
    this;
    tags = [];
    if ((ref = custom_settings.safeAsConceptName) != null ? ref.value : void 0) {
      tags.push("✓ Name: " + custom_settings.safeAsConceptName.value);
    } else {
      tags.push("✘ " + $$('custom.data.type.goobi.missing.config'));
    }
    if (custom_settings.safeAsConceptURI.value) {
      tags.push("✓ URI: " + custom_settings.safeAsConceptURI.value);
    } else {
      tags.push("✘ " + $$('custom.data.type.goobi.missing.config'));
    }
    return tags;
  };

  return CustomDataTypeGoobi;

})(CustomDataTypeWithCommons);

CustomDataType.register(CustomDataTypeGoobi);