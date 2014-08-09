define [
    'utils'
], (utils) ->

    class HelpScoutAPI
        constructor: (options={}) ->
            {apiKey} = options
            unless apiKey
                throw new Error('Bro, gimme an API key. Just do it. Do it.')
                return

            console.warn 'BTW this is really not secure. Hopefully Help Scout comes out with API scoping.'

            # Build this and cache it. For speed and shit.
            @base64AuthKey = btoa(apiKey + ':X')

            # Extend with options.
            utils.extend @, options

            return

        urlRoot: 'https://api.helpscout.net'
        version: 'v1'
        resources: [
            'conversations'
            'customers'
            'mailboxes'
            'search'
            'tags'
            'users'
            'workflows'
        ]

        request: (options) ->
            {resource, method, data} = options

            unless resource in @resources
                resourcesStr = @resources.join ' ,'
                throw new Error("That's not a real endpoint. Should be one of #{resourcesStr}")

            @_request @_getRequestOptions(options)

        # Transforms the options into something another library, like jQuery, would like.
        _getRequestOptions: (options) ->
            return options unless options

            return {
                url: @getUrl(options.resource)
                type: options.method
                dataType: 'json'
                data: options.data
                headers:
                    Authorization: 'Basic ' + @base64AuthKey
            }

        getUrl: (resource) ->
            validParts = []
            r = if resource then "#{resource}.json" else ''
            for part in [@urlRoot, @version, r]
                validParts.push(part) if part

            return validParts.join '/'

        # Feel free to override with your own request library.
        _request: jQuery?.ajax or ->
            console.warn 'You need to use jQuery or implement some kind of request library.'
