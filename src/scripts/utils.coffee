define {

    extend: (out, objs...) ->
        out = out or {}

        for obj in objs
            for key, val of obj
                if obj.hasOwnProperty(key)
                    out[key] = val

        return out
}
