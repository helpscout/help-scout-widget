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
            @el.innerHTML = @template()

            # Listen for clicks.
            @el.querySelector('.hs-widget-icon')
                .addEventListener 'click', @toggle.bind(@)

            @el.querySelector('.hs-widget-close')
                .addEventListener 'click', @render.bind(@)

            # Listen for form submissions and make those ajaxy.
            @el.querySelector('.hs-widget-form')
                .addEventListener 'submit', @submit.bind(@)

            return @

        template: (context={}) ->
            {color, email} = context
            color ?= '#4f9ae5'
            email ?= ''

            """
                <div class="hs-widget-icon">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="39px" height="39px" viewBox="0 0 39 39" enable-background="new 0 0 39 39" xml:space="preserve">
                        <g>
                            <path fill="rgba(46, 49, 51, 0.6)" d="M31.425,34.514c-0.432-0.944-0.579-2.007-0.591-2.999c4.264-3.133,7.008-7.969,7.008-13.409
                                C37.842,8.658,29.594,1,19.421,1S1,8.658,1,18.105c0,9.446,7.932,16.79,18.105,16.79c1.845,0,3.94,0.057,5.62-0.412
                                c0.979,1.023,2.243,2.3,2.915,2.791c3.785,2.759,7.571,0,7.571,0S32.687,37.274,31.425,34.514z" style="fill: #{color};"></path>
                            <g>
                                <g>
                                    <path fill="#FFFFFF" d="M16.943,19.467c0-3.557,4.432-3.978,4.432-6.058c0-0.935-0.723-1.721-2.383-1.721
                                        c-1.508,0-2.773,0.725-3.709,1.87l-2.441-2.743c1.598-1.9,4.01-2.924,6.602-2.924c3.891,0,6.271,1.959,6.271,4.765
                                        c0,4.4-5.037,4.732-5.037,7.265c0,0.481,0.243,0.994,0.574,1.266l-3.316,0.965C17.303,21.459,16.943,20.522,16.943,19.467z
                                         M16.943,26.19c0-1.326,1.114-2.441,2.44-2.441c1.327,0,2.442,1.115,2.442,2.441c0,1.327-1.115,2.441-2.442,2.441
                                        C18.058,28.632,16.943,27.518,16.943,26.19z" style="fill: rgb(255, 255, 255);"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <div class="hs-widget-form-container">
                    <form class="hs-widget-form">
                        <h4>Send us a message</h4>
                        <p>We love hearing from you.</p>
                        <input class="hs-widget-form-control" type="email" name="email" value="#{email}" placeholder="Your email" required autofocus/>
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
