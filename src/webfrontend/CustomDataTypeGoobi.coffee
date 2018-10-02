class CustomDataTypeGoobi extends CustomDataTypeWithCommons

  #######################################################################
  # bugfix, may be removed after next update (1.3.2017)
  getL10NPrefix: ->
    "custom.data.type.goobi"


  #######################################################################
  # return name of plugin
  getCustomDataTypeName: ->
    "custom:base.custom-data-type-goobi.goobi"


  #######################################################################
  # return name (l10n) of plugin
  getCustomDataTypeNameLocalized: ->
    $$("custom.data.type.goobi.name")


  #######################################################################
  # get frontend-language
  getFrontendLanguage: () ->
    # language
    desiredLanguage = ez5.loca.getLanguage()
    desiredLanguage = desiredLanguage.split('-')
    desiredLanguage = desiredLanguage[0]

    desiredLanguage

  #######################################################################
  # read info from goobi-terminology
  __getAdditionalTooltipInfo: (uri, tooltip, extendedInfo_xhr) ->

    that = @
    encodedURI = encodeURIComponent uri
    # abort eventually running request
    if extendedInfo_xhr.xhr != undefined
      extendedInfo_xhr.xhr.abort()

    # start new request and download goobi-process-record via identifier / uri
    goobi_endpoint_token = if that.getCustomMaskSettings().goobi_endpoint_token?.value then that.getCustomMaskSettings().goobi_endpoint_token?.value else ''
    goobi_endpoint_token = encodeURIComponent(goobi_endpoint_token)

    goobi_projects = if that.getCustomMaskSettings().projects?.value then that.getCustomMaskSettings().projects?.value else ''
    goobi_projects = encodeURIComponent(goobi_projects)

    url =  'https://goobi.prizepapers.gbv.de/goobi/api/processes/search?token=' + goobi_endpoint_token + '&field='+that.getCustomSchemaSettings().safeAsConceptURI?.value+'&offset=0&orderby=' + that.getCustomSchemaSettings().safeAsConceptURI?.value + '&descending=true&value=' + encodedURI + '&limit=1&filterProjects=' + goobi_projects
    url = location.protocol + '//jsontojsonp.gbv.de/?url=' + encodeURIComponent url

    extendedInfo_xhr.xhr = new (CUI.XHR)(url: url)
    extendedInfo_xhr.xhr.start()
    .done((data, status, statusText) ->
      htmlContent = '<span style="font-weight: bold; padding: 3px 6px;">' + $$('custom.data.type.goobi.config.parameter.mask.infopopup.popup.info') + '</span>'
      htmlContent += '<table style="border-spacing: 10px; border-collapse: separate;">'

      if data?[0]?.metadata
        metadatas = data?[0]?.metadata
        valuePairs = {}
        for key, metadata of metadatas
          for entry, key2 in metadata
            # get label in frontend-language if possible
            if entry.labels?[that.getFrontendLanguage()]
              label =  entry.labels?[that.getFrontendLanguage()]
            else
              label = entry.labels[Object.keys(entry.labels)[0]]
            if ! valuePairs[label]
              valuePairs[label] = []
            valuePairs[label].push entry['value']
        for key, metadata of valuePairs
          htmlContent += '<tr><td style="min-width:150px;"><b>' + key + ':</b></td><td>'
          for entry, key2 in metadata 
            htmlContent += entry
          htmlContent += '</td></tr>'
        htmlContent += '</table>'
      tooltip.DOM.innerHTML = htmlContent
      tooltip.autoSize()
    )

    return


  #######################################################################
  # handle suggestions-menu
  __updateSuggestionsMenu: (cdata, cdata_form, searchstring, input, suggest_Menu, searchsuggest_xhr, layout) ->
    that = @

    delayMillisseconds = 200

    setTimeout ( ->

        goobi_searchterm = searchstring
        goobi_countSuggestions = 20
        goobi_searchfield = that.getCustomMaskSettings().searchfields?.value.split(',').shift()


        if cdata_form
          goobi_searchterm = cdata_form.getFieldsByName("searchbarInput")[0].getValue()
          goobi_countSuggestions = cdata_form.getFieldsByName("countOfSuggestions")[0].getValue()
          goobi_searchfield = cdata_form.getFieldsByName("searchfieldSelect")[0].getValue()

        if goobi_searchterm.length == 0
            return

        # run autocomplete-search via xhr
        if searchsuggest_xhr.xhr != undefined
            # abort eventually running request
            searchsuggest_xhr.xhr.abort()

        # start new request
        goobi_endpoint_token = if that.getCustomMaskSettings().goobi_endpoint_token?.value then that.getCustomMaskSettings().goobi_endpoint_token?.value else ''
        goobi_endpoint_token = encodeURIComponent(goobi_endpoint_token)

        goobi_projects = if that.getCustomMaskSettings().projects?.value then that.getCustomMaskSettings().projects?.value else ''
        goobi_projects = encodeURIComponent(goobi_projects)

        apiUrl = 'https://goobi.prizepapers.gbv.de/goobi/api/processes/search?token=' + goobi_endpoint_token + '&field=' + goobi_searchfield + '&value=' + goobi_searchterm + '&limit=' + goobi_countSuggestions + '&offset=0&orderby=' + goobi_searchfield + '&descending=true&filterProjects=' + goobi_projects

        url = location.protocol + '//jsontojsonp.gbv.de/?url=' + encodeURIComponent(apiUrl)

        searchsuggest_xhr.xhr = new (CUI.XHR)(url: url)
        searchsuggest_xhr.xhr.start().done((data, status, statusText) ->

            # init xhr for tooltipcontent
            extendedInfo_xhr = { "xhr" : undefined }

            # create new menu with suggestions
            menu_items = []
            # the actual Featureclass
            for suggestion, key in data
              suggestion = suggestion.metadata
              if suggestion?.identifier_doi
                safeAsConceptName = that.getCustomSchemaSettings().safeAsConceptName?.value
                safeAsConceptURI = that.getCustomSchemaSettings().safeAsConceptURI?.value

                conceptNameCandidate = if suggestion?[safeAsConceptName] then suggestion?[safeAsConceptName][0].value else ''
                conceptURICandidate = if suggestion?[safeAsConceptURI] then suggestion?[safeAsConceptURI][0].value else ''

                if conceptNameCandidate != '' && conceptURICandidate != ''
                  do(key) ->
                    item =
                      text: conceptNameCandidate
                      value: conceptURICandidate
                      tooltip:
                        markdown: true
                        placement: "nw"
                        content: (tooltip) ->
                            that.__getAdditionalTooltipInfo(conceptURICandidate, tooltip, extendedInfo_xhr)
                            new CUI.Label(icon: "spinner", text: $$('custom.data.type.goobi.config.parameter.mask.show_infopopup.loading.label'))
                    menu_items.push item

            # set new items to menu
            itemList =
              onClick: (ev2, btn) ->
                # lock in save data
                cdata.conceptURI = btn.getOpt("value")
                cdata.conceptName = btn.getText()
                # update the layout in form
                that.__updateResult(cdata, layout)
                # hide suggest-menu
                suggest_Menu.hide()
                # close popover
                if that.popover
                  that.popover.hide()
              items: menu_items

            # if no hits set "empty" message to menu
            if itemList.items.length == 0
              itemList =
                items: [
                  text: "kein Treffer"
                  value: undefined
                ]

            suggest_Menu.setItemList(itemList)

            suggest_Menu.show()

        )
    ), delayMillisseconds


  #######################################################################
  # create form
  __getEditorFields: (cdata) ->
    # read searchfields from datamodel
    searchOptions = []
    searchfields = this.getCustomMaskSettings().searchfields?.value.split ','
    for searchfield, key in searchfields
      option=
        value: searchfield
        text: $$('custom.data.type.goobi.modal.form.text.searchfield.' + searchfield)
      searchOptions.push option

    # form fields
    fields = [
      {
        type: CUI.Select
        class: "commonPlugin_Select"
        undo_and_changed_support: false
        form:
            label: $$('custom.data.type.goobi.modal.form.text.count')
        options: [
          (
              value: 10
              text: '10 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          )
          (
              value: 20
              text: '20 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          )
          (
              value: 50
              text: '50 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          )
          (
              value: 100
              text: '100 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          )
          (
              value: 500
              text: '500 ' + $$('custom.data.type.goobi.modal.form.text.count_short')
          )
        ]
        name: 'countOfSuggestions'
      }
      {
        type: CUI.Select
        class: "commonPlugin_Select"
        undo_and_changed_support: false
        form:
            label: $$('custom.data.type.goobi.modal.form.text.searchfield')
        options: searchOptions
        name: 'searchfieldSelect'
      }
      {
        type: CUI.Input
        class: "commonPlugin_Input"
        undo_and_changed_support: false
        form:
            label: $$("custom.data.type.goobi.modal.form.text.searchbar")
        placeholder: $$("custom.data.type.goobi.modal.form.text.searchbar.placeholder")
        name: "searchbarInput"
      }]

    fields


  #######################################################################
  # renders the "result" in original form (outside popover)
  __renderButtonByData: (cdata) ->

    that = @

    # when status is empty or invalid --> message

    switch @getDataStatus(cdata)
      when "empty"
        return new CUI.EmptyLabel(text: $$("custom.data.type.goobi.edit.no_goobi")).DOM
      when "invalid"
        return new CUI.EmptyLabel(text: $$("custom.data.type.goobi.edit.no_valid_goobi")).DOM

    extendedInfo_xhr = { "xhr" : undefined }

    # if status is ok
    cdata.conceptURI = CUI.parseLocation(cdata.conceptURI).url

    # output Button with Name of picked Entry and URI
    new CUI.HorizontalLayout
      maximize: true
      left:
        content:
          new CUI.Label
            centered: true
            text: cdata.conceptName
      center:
        content:
          # Url to the Source
          new CUI.Button
            appearance: "link"
            #href: cdata.conceptURI
            #target: "_blank"
            icon_left: new CUI.Icon(class: "fa-info-circle")
            tooltip:
              markdown: true
              placement: 'n'
              content: (tooltip) ->
                uri = cdata.conceptURI
                # get jskos-details-data
                that.__getAdditionalTooltipInfo(uri, tooltip, extendedInfo_xhr)
                # loader, until details are xhred
                new CUI.Label(icon: "spinner", text: $$('custom.data.type.dante.modal.form.popup.loadingstring'))
            text: ""
      right: null
    .DOM


  #######################################################################
  # zeige die gewählten Optionen im Datenmodell unter dem Button an
  getCustomDataOptionsInDatamodelInfo: (custom_settings) ->
    console.log custom_settings
    @
    tags = []
    if custom_settings.safeAsConceptName?.value
      tags.push "✓ Name: " + custom_settings.safeAsConceptName.value
    else
      tags.push "✘ " + $$('custom.data.type.goobi.missing.config')

    if custom_settings.safeAsConceptURI.value
      tags.push "✓ URI: " + custom_settings.safeAsConceptURI.value
    else
      tags.push "✘ " + $$('custom.data.type.goobi.missing.config')
    tags


CustomDataType.register(CustomDataTypeGoobi)