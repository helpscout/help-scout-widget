define [
    'conversations'
    'view'
], (HelpScout, WidgetView) ->

    class Interface
        constructor: (options) ->
            api = new HelpScout options

            # NOTE: A future use would be to let this instance manage multiple
            # widgets on the page that all talk to the API with the same @apiKey.
            views = []

            # Allow initialization on elements.
            init = (options) ->
                view = new WidgetView(options)

                # TODO: Implement custom events emitter.
                view.onSubmit = (data) ->
                    api.create
                        mailboxId: options.mailboxId
                        customer: {email: data.email}
                        body: data.body

                views.push view
                return view

            return {init, views}
