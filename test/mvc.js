; ((w, d) => {
    var _viewElement = null,
        _defaultRoute = null,
        _rendered = false;
    var jsMvc = function () {
        //mapping object for the routes
        this._routeMap = {};
    }
    var routeObj = function (c, r, t) {
        this.controller = c
        this.route = r
        this.template = t
    }
    jsMvc.prototype.AddRoute = function (controller, route, template) {

        this._routeMap[route] = new routeObj(controller, route, template)
    }

    jsMvc.prototype.Initialize = function () {

        //create the update view delegate
        var updateViewDelegate = updateView.bind(this)

        //get the view element reference
        _viewElement = d.querySelector('[view]')

        if (!_viewElement) return;

        //set a default route
        _defaultRoute = this._routeMap[Object.getOwnPropertyNames(this._routeMap)[0]];


        //wire up the hash change event with the update view delegate
        w.onhashchange = updateViewDelegate;

        //call the update view delegate
        updateViewDelegate()

    }

    var updateView = function () {

        //get the route name from the address bar hash
        var pageHash = window.location.hash.replace('#', ''),
            routeName = null,
            routeObj = null;
        routeName = pageHash.replace('/', '');
        _rendered = false;


        //fetch the route object using the route name
        routeObj = this._routeMap[routeName];
        if (!routeObj) { routeObj = _defaultRoute }

        //render the view
        /*
            // loaddata tu api truyen argument the view, 
            loadTemplate(routeObj, _viewElement, pageHash) 
        */
        // loadView(routeObj, _viewElement, routeObj.controller)
        loadView(routeObj, _viewElement)

    }

    var loadTemplate = (routeObject, viewElement) => {

        var xmlhttp
        if (w.XMLHttpRequest) {
            //code for IE7, chrome, opera, safari
            xmlhttp = new XMLHttpRequest()


        } else {
            //code for IE6, IE5
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
        }

        xmlhttp.onreadystatechange = () => {

            if (xmlhttp.readyState === 4 && xmlhttp.status == 200) {
                //load view
                console.log(routeObject)
                loadView(routeObject, viewElement, xmlhttp.responseText)




            }
        };

        xmlhttp.open('GET', routeObject.template, true)
        xmlhttp.send()

    }

    var loadView = function (routeObject, viewElement) {

        //create the model 
        var model = {}

        //call the controller function of the route
        routeObject.controller(model)
        console.log(model.Message)
        //replace the view html tokens with the model properties
        // viewHtml = replaceTokens(viewHtml, model)


        //render the view
        if (!_rendered) {
            // viewElement.innerHTML = viewHtml
            _rendered = true
        }

        viewElement.innerHTML = model.Message
    }

    var replaceTokens = (viewHtml, model) => {

        var modelProps = Object.getOwnPropertyNames(model)

        modelProps.forEach((el, id, array) => {
            viewHtml = viewHtml.replace('{{' + el + '}}', model[el])

        })

        return viewHtml

    }

    w['jsMvc'] = new jsMvc()


})(window, document)



//add the route information
//create an update view function 
//wire up the update view function with hash changes
//fetch the view html
//replace the token
//render the view html in the view container