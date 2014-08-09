define [
    'conversations'
    'view'
], (HelpScout, WidgetView) ->

    class Interface
        constructor: (options={}) ->
            {apiKey} = options

            # TODO: Use revealing constructor pattern to avoid people messing with this.
            # http://domenic.me/2014/02/13/the-revealing-constructor-pattern/
            @api = new HelpScout {apiKey}

            # NOTE: A future use would be to let this instance manage multiple
            # widgets on the page that all talk to the API with the same @apiKey.
            @views = []

            return @

        # Allow initialization on elements.
        init: (options) ->
            view = new WidgetView(options)

            # TODO: Implement custom events emitter.
            onSubmit = (data) ->
                @api.create
                    mailboxId: options.mailboxId
                    customer: {email: data.email}
                    body: data.body

            view.onSubmit = onSubmit.bind @

            @views.push view
            return view
