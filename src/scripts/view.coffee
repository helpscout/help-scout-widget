define ->

    viewCounter = 0

    getFormData = (formEl) ->
        data = {}
        for el in formEl.elements
            data[el.name] = el.value unless el.type is 'submit'

        return data

    class WidgetView
        constructor: ->
            @el = document.createElement 'div'
            @el.classList.add 'hs-widget'
            @el.innerHTML = @template
            document.body.appendChild @el

            # Give this guy a unique ID.
            @id = 'v' + viewCounter
            viewCounter++

            # Listen for clicks.
            @el.querySelector('.hs-widget-icon')
                .addEventListener 'click', @toggle.bind(@)

            # Listen for form submissions and make those ajaxy.
            @el.querySelector('.hs-widget-form')
                .addEventListener 'submit', @submit.bind(@)

            return @

        template: """
            <div class="hs-widget-icon">?</div>
            <form class="hs-widget-form">
                <h4>Send us a message</h4>
                <input type="email" name="email" value="" placeholder="email"/>
                <textarea name="body" placeholder="Hey there! I need help with..."></textarea>
                <button type="submit">Let us know</button>
            </form>
            <div class="hs-widget-form-success">
                <p>Yay, you did it!</p>
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

        remove: ->
            # NOTE: We could be extra nice and remove event listeners here, but
            # instead let's just be safe and not create external references to
            # it so it's cleaned up with GC.
            @el.remove()
