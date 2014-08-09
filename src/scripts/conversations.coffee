define [
    'api'
    'utils'
], (HelpScoutAPI, utils) ->

    class ConversationsAPI extends HelpScoutAPI
        create: (options) ->
            {customer, mailboxId, body} = options

            # Build the defaults for a conversation.
            maxSubjectLen = 100
            subject = body
            if subject.length > maxSubjectLen
                subject = body.substring(0, maxSubjectLen-3) + '...'

            @request {
                method: 'post'
                data:
                    customer: customer
                    subject: body.substring(0, 50) + '...'
                    mailbox:
                        id: mailboxId
                    threads: [
                        type: 'customer'
                        createdBy: utils.extend({type: 'customer'}, customer)
                        body: body
                    ]
            }

        request: (options) ->
            if options?
                options.resource ?= 'conversations'

            super options
