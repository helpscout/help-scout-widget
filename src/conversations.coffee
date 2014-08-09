define [
    'api'
], (HelpScoutAPI) ->

    class ConversationsAPI extends HelpScoutAPI
        create: (options) ->
            {customer, mailboxId, body} = options

            # Build the defaults for a conversation.
            maxSubjectLen = 100
            subject = body
            if subject.length > maxSubjectLen
                subject = body.substring(0, maxSubjectLen-3) + '...'

            options =
                customer: customer
                subject: body.substring(0, 50) + '...'
                threads: [
                    type: 'customer'
                    createdBy: customer
                    body: body
                ]

            @request options

        request: (options) ->
            if options?
                options.resource ?= 'conversations'
                options.type = 'jsonp'

            super options
