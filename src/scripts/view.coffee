define ->

    viewCounter = 0

    getFormData = (formEl) ->
        data = {}
        for el in formEl.elements
            data[el.name] = el.value unless el.type is 'submit'

        return data

    class WidgetView
        constructor: ->
            # Give this guy a unique ID.
            @id = 'v' + viewCounter
            viewCounter++

            @el = document.createElement 'div'
            @el.classList.add 'hs-widget'
            @render()
            document.body.appendChild @el

            return @

        render: ->
            @el.classList.remove 'hs-widget-active'
            @el.classList.remove 'hs-widget-form-success-active'
            @el.innerHTML = @template

            # Listen for clicks.
            @el.querySelector('.hs-widget-icon')
                .addEventListener 'click', @toggle.bind(@)

            @el.querySelector('.hs-widget-close')
                .addEventListener 'click', @render.bind(@)

            # Listen for form submissions and make those ajaxy.
            @el.querySelector('.hs-widget-form')
                .addEventListener 'submit', @submit.bind(@)

            return @

        template: """
            <div class="hs-widget-icon">?</div>
            <div class="hs-widget-form-container">
                <form class="hs-widget-form">
                    <h4>Send us a message</h4>
                    <p>We love hearing from you.</p>
                    <input class="hs-widget-form-control" type="email" name="email" value="" placeholder="Your email" required autofocus/>
                    <textarea class="hs-widget-form-control" name="body" placeholder="Hey there! I need help with..." required></textarea>
                    <div class="hs-widget-btns">
                        <button class="hs-widget-btn" type="submit">Let us know</button>
                    </div>
                </form>
                <div class="hs-widget-form-success">
                    <br><br><br><br>
                    <h4>We've got you covered.</h4>
                    <p>One of us will reach out to you by email or phone shortly. Just hang tight!</p>
                    <button class="hs-widget-btn hs-widget-close">Got it!</button>
                </div>
            </div>
        """

        toggle: ->
            if @el.classList.contains 'hs-widget-active'
                @hide()
            else
                @show()
            return @

        show: ->
            @el.classList.add 'hs-widget-active'
            return @

        hide: ->
            @el.classList.remove 'hs-widget-active'
            return @

        submit: (e) ->
            e.preventDefault()
            data = getFormData @el.querySelector('.hs-widget-form')

            @onSubmit data
            return false

        # Outlet to publish events to subscribers.
        onSubmit: (data) ->

        showSuccess: ->
            @el.classList.add 'hs-widget-form-success-active'

        remove: ->
            # NOTE: We could be extra nice and remove event listeners here, but
            # instead let's just be safe and not create external references to
            # it so it's cleaned up with GC.
            @el.remove()
