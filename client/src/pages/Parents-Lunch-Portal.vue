<template>
    <!-- Comment -->
    <v-container fill-height fill-width fluid style="flex-wrap: wrap">
        <v-layout justify-center wrap fill-width>
            <v-stepper v-model="e6" vertical fill-width>
                <v-stepper-step :complete="e6 > 1" step="1">
                    Select a Child to buy lunch/snacks for:
                    <small>
                        I will add current lunch/snack balance next to children's names
                    </small>
                </v-stepper-step>
                <!--need to add an if statement if no child exists? this should never happen tho-->
                <v-stepper-content step="1">
                    <validation-observer ref="observer" v-slot="{ invalid }">
                        <form @submit.prevent="submit">
                            <v-radio-group v-model="radioGroup">
                                <v-radio v-for="value in myChildData"
                                         :key="value.id"
                                         :label="`${value.first_name} ${value.last_name}: Balance - $ ${value.balence}`"
                                         :value="value.id"></v-radio>
                            </v-radio-group>
                            <v-btn class="mr-4"
                                   type="submit"
                                   :disabled="radioGroup == ''"
                                   color="secondary"
                                   @click="e6 = 2; printMe()">
                                submit
                            </v-btn>
                        </form>
                    </validation-observer>
                </v-stepper-content>
                <!--with the child id and the total amount spent in the jotform we will mutate the balance of the child and add the total to their balance-->
                <!--hard part will be getting the total from the jot form. Will probably have to use stripe api to get the most recent purchase-->
                <!--double check the customer id matches the parents customer id, then add the total of that order to the child's balance-->
                <!-- also need to figure out a clever way to run the query one completion of the jotform-->
                <!-- i do not want to rely on them clicking submit then the complete form button to start the stripe api query-->
                <v-stepper-step :complete="e6 > 2" step="2">
                    Lunch/Snack Checkout
                    <small>
                        Please Select a Lunch/Snack Options
                    </small>
                </v-stepper-step>

                <v-stepper-content step="2">
                    <validation-observer ref="observer" v-slot="{ invalid }">
                        <form @submit.prevent="submit">
                            <validation-provider v-slot="{ errors }"
                                                 name="Lunch/Snack Options"
                                                 rules="required">
                                <v-select v-model="lunchSelect"
                                          :items="lunchOptions"
                                          :error-messages="errors"
                                          label="Select Lunch/Snack Option"
                                          data-vv-name="Lunch/Snack Option"
                                          required></v-select>
                            </validation-provider>
                            <v-btn class="mr-4"
                                   type="submit"
                                   :disabled="lunchSelect == ''"
                                   color="secondary"
                                   @click="determineBalance(); e6 = 3">
                                submit
                            </v-btn>
                        </form>
                    </validation-observer>
                </v-stepper-content>

                <v-stepper-step :complete="e6 > 3" step="3">
                    Lunch/Snack Checkout

                </v-stepper-step>

                <v-stepper-content step="3">
                    <v-card class="mb-12">
                        <div v-if="lunchSelect == '5 Days of Lunch'">
                            <iframe id="JotFormIFrame-211798019456060"
                                    title="Buy Lunch and Snack for your Child!"
                                    onload="window.parent.scrollTo(0,0)"
                                    allowtransparency="true"
                                    allowfullscreen="true"
                                    allow="geolocation; microphone; camera"
                                    src="https://form.jotform.com/211798019456060"
                                    frameborder="0"
                                    style="
          min-width: 100%;
          height:539px;
          border:none;"
                                    scrolling="no">
                            </iframe>
                            <script type="text/javascript">
                                var ifr = document.getElementById("JotFormIFrame-211798019456060");
                                if (ifr) {
                                    var src = ifr.src;
                                    var iframeParams = [];
                                    if (window.location.href && window.location.href.indexOf("?") > -1) {
                                        iframeParams = iframeParams.concat(window.location.href.substr(window.location.href.indexOf("?") + 1).split('&'));
                                    }
                                    if (src && src.indexOf("?") > -1) {
                                        iframeParams = iframeParams.concat(src.substr(src.indexOf("?") + 1).split("&"));
                                        src = src.substr(0, src.indexOf("?"))
                                    }
                                    iframeParams.push("isIframeEmbed=1");
                                    ifr.src = src + "?" + iframeParams.join('&');
                                }
                                window.handleIFrameMessage = function (e) {
                                    if (typeof e.data === 'object') { return; }
                                    var args = e.data.split(":");
                                    if (args.length > 2) { iframe = document.getElementById("JotFormIFrame-" + args[(args.length - 1)]); } else { iframe = document.getElementById("JotFormIFrame"); }
                                    if (!iframe) { return; }
                                    switch (args[0]) {
                                        case "scrollIntoView":
                                            iframe.scrollIntoView();
                                            break;
                                        case "setHeight":
                                            iframe.style.height = args[1] + "px";
                                            break;
                                        case "collapseErrorPage":
                                            if (iframe.clientHeight > window.innerHeight) {
                                                iframe.style.height = window.innerHeight + "px";
                                            }
                                            break;
                                        case "reloadPage":
                                            window.location.reload();
                                            break;
                                        case "loadScript":
                                            if (!window.isPermitted(e.origin, ['jotform.com', 'jotform.pro'])) { break; }
                                            var src = args[1];
                                            if (args.length > 3) {
                                                src = args[1] + ':' + args[2];
                                            }
                                            var script = document.createElement('script');
                                            script.src = src;
                                            script.type = 'text/javascript';
                                            document.body.appendChild(script);
                                            break;
                                        case "exitFullscreen":
                                            if (window.document.exitFullscreen) window.document.exitFullscreen();
                                            else if (window.document.mozCancelFullScreen) window.document.mozCancelFullScreen();
                                            else if (window.document.mozCancelFullscreen) window.document.mozCancelFullScreen();
                                            else if (window.document.webkitExitFullscreen) window.document.webkitExitFullscreen();
                                            else if (window.document.msExitFullscreen) window.document.msExitFullscreen();
                                            break;
                                    }
                                    var isJotForm = (e.origin.indexOf("jotform") > -1) ? true : false;
                                    if (isJotForm && "contentWindow" in iframe && "postMessage" in iframe.contentWindow) {
                                        var urls = { "docurl": encodeURIComponent(document.URL), "referrer": encodeURIComponent(document.referrer) };
                                        iframe.contentWindow.postMessage(JSON.stringify({ "type": "urls", "value": urls }), "*");
                                    }
                                };
                                window.isPermitted = function (originUrl, whitelisted_domains) {
                                    var url = document.createElement('a');
                                    url.href = originUrl;
                                    var hostname = url.hostname;
                                    var result = false;
                                    if (typeof hostname !== 'undefined') {
                                        whitelisted_domains.forEach(function (element) {
                                            if (hostname.slice((-1 * element.length - 1)) === '.'.concat(element) || hostname === element) {
                                                result = true;
                                            }
                                        });
                                        return result;
                                    }
                                }
                                if (window.addEventListener) {
                                    window.addEventListener("message", handleIFrameMessage, false);
                                } else if (window.attachEvent) {
                                    window.attachEvent("onmessage", handleIFrameMessage);
                                }
                            </script>
                        </div>
                        <div v-else-if="lunchSelect == '20 Days of Lunch'">

                            <iframe id="JotFormIFrame-211894496402158"
                                    title="Month of Lunch"
                                    onload="window.parent.scrollTo(0,0)"
                                    allowtransparency="true"
                                    allowfullscreen="true"
                                    allow="geolocation; microphone; camera"
                                    src="https://form.jotform.com/211894496402158"
                                    frameborder="0"
                                    style="
      min-width: 100%;
      height:539px;
      border:none;"
                                    scrolling="no">
                            </iframe>
                            <script type="text/javascript">
                                var ifr = document.getElementById("JotFormIFrame-211894496402158");
                                if (ifr) {
                                    var src = ifr.src;
                                    var iframeParams = [];
                                    if (window.location.href && window.location.href.indexOf("?") > -1) {
                                        iframeParams = iframeParams.concat(window.location.href.substr(window.location.href.indexOf("?") + 1).split('&'));
                                    }
                                    if (src && src.indexOf("?") > -1) {
                                        iframeParams = iframeParams.concat(src.substr(src.indexOf("?") + 1).split("&"));
                                        src = src.substr(0, src.indexOf("?"))
                                    }
                                    iframeParams.push("isIframeEmbed=1");
                                    ifr.src = src + "?" + iframeParams.join('&');
                                }
                                window.handleIFrameMessage = function (e) {
                                    if (typeof e.data === 'object') { return; }
                                    var args = e.data.split(":");
                                    if (args.length > 2) { iframe = document.getElementById("JotFormIFrame-" + args[(args.length - 1)]); } else { iframe = document.getElementById("JotFormIFrame"); }
                                    if (!iframe) { return; }
                                    switch (args[0]) {
                                        case "scrollIntoView":
                                            iframe.scrollIntoView();
                                            break;
                                        case "setHeight":
                                            iframe.style.height = args[1] + "px";
                                            break;
                                        case "collapseErrorPage":
                                            if (iframe.clientHeight > window.innerHeight) {
                                                iframe.style.height = window.innerHeight + "px";
                                            }
                                            break;
                                        case "reloadPage":
                                            window.location.reload();
                                            break;
                                        case "loadScript":
                                            if (!window.isPermitted(e.origin, ['jotform.com', 'jotform.pro'])) { break; }
                                            var src = args[1];
                                            if (args.length > 3) {
                                                src = args[1] + ':' + args[2];
                                            }
                                            var script = document.createElement('script');
                                            script.src = src;
                                            script.type = 'text/javascript';
                                            document.body.appendChild(script);
                                            break;
                                        case "exitFullscreen":
                                            if (window.document.exitFullscreen) window.document.exitFullscreen();
                                            else if (window.document.mozCancelFullScreen) window.document.mozCancelFullScreen();
                                            else if (window.document.mozCancelFullscreen) window.document.mozCancelFullScreen();
                                            else if (window.document.webkitExitFullscreen) window.document.webkitExitFullscreen();
                                            else if (window.document.msExitFullscreen) window.document.msExitFullscreen();
                                            break;
                                    }
                                    var isJotForm = (e.origin.indexOf("jotform") > -1) ? true : false;
                                    if (isJotForm && "contentWindow" in iframe && "postMessage" in iframe.contentWindow) {
                                        var urls = { "docurl": encodeURIComponent(document.URL), "referrer": encodeURIComponent(document.referrer) };
                                        iframe.contentWindow.postMessage(JSON.stringify({ "type": "urls", "value": urls }), "*");
                                    }
                                };
                                window.isPermitted = function (originUrl, whitelisted_domains) {
                                    var url = document.createElement('a');
                                    url.href = originUrl;
                                    var hostname = url.hostname;
                                    var result = false;
                                    if (typeof hostname !== 'undefined') {
                                        whitelisted_domains.forEach(function (element) {
                                            if (hostname.slice((-1 * element.length - 1)) === '.'.concat(element) || hostname === element) {
                                                result = true;
                                            }
                                        });
                                        return result;
                                    }
                                }
                                if (window.addEventListener) {
                                    window.addEventListener("message", handleIFrameMessage, false);
                                } else if (window.attachEvent) {
                                    window.attachEvent("onmessage", handleIFrameMessage);
                                }
                            </script>
                        </div>
                        <div v-else-if="lunchSelect == '$20 Snack Credit'">


                            <iframe id="JotFormIFrame-211895099775171"
                                    title="Snacks"
                                    onload="window.parent.scrollTo(0,0)"
                                    allowtransparency="true"
                                    allowfullscreen="true"
                                    allow="geolocation; microphone; camera"
                                    src="https://form.jotform.com/211895099775171"
                                    frameborder="0"
                                    style="
      min-width: 100%;
      height:539px;
      border:none;"
                                    scrolling="no">
                            </iframe>
                            <script type="text/javascript">
                                var ifr = document.getElementById("JotFormIFrame-211895099775171");
                                if (ifr) {
                                    var src = ifr.src;
                                    var iframeParams = [];
                                    if (window.location.href && window.location.href.indexOf("?") > -1) {
                                        iframeParams = iframeParams.concat(window.location.href.substr(window.location.href.indexOf("?") + 1).split('&'));
                                    }
                                    if (src && src.indexOf("?") > -1) {
                                        iframeParams = iframeParams.concat(src.substr(src.indexOf("?") + 1).split("&"));
                                        src = src.substr(0, src.indexOf("?"))
                                    }
                                    iframeParams.push("isIframeEmbed=1");
                                    ifr.src = src + "?" + iframeParams.join('&');
                                }
                                window.handleIFrameMessage = function (e) {
                                    if (typeof e.data === 'object') { return; }
                                    var args = e.data.split(":");
                                    if (args.length > 2) { iframe = document.getElementById("JotFormIFrame-" + args[(args.length - 1)]); } else { iframe = document.getElementById("JotFormIFrame"); }
                                    if (!iframe) { return; }
                                    switch (args[0]) {
                                        case "scrollIntoView":
                                            iframe.scrollIntoView();
                                            break;
                                        case "setHeight":
                                            iframe.style.height = args[1] + "px";
                                            break;
                                        case "collapseErrorPage":
                                            if (iframe.clientHeight > window.innerHeight) {
                                                iframe.style.height = window.innerHeight + "px";
                                            }
                                            break;
                                        case "reloadPage":
                                            window.location.reload();
                                            break;
                                        case "loadScript":
                                            if (!window.isPermitted(e.origin, ['jotform.com', 'jotform.pro'])) { break; }
                                            var src = args[1];
                                            if (args.length > 3) {
                                                src = args[1] + ':' + args[2];
                                            }
                                            var script = document.createElement('script');
                                            script.src = src;
                                            script.type = 'text/javascript';
                                            document.body.appendChild(script);
                                            break;
                                        case "exitFullscreen":
                                            if (window.document.exitFullscreen) window.document.exitFullscreen();
                                            else if (window.document.mozCancelFullScreen) window.document.mozCancelFullScreen();
                                            else if (window.document.mozCancelFullscreen) window.document.mozCancelFullScreen();
                                            else if (window.document.webkitExitFullscreen) window.document.webkitExitFullscreen();
                                            else if (window.document.msExitFullscreen) window.document.msExitFullscreen();
                                            break;
                                    }
                                    var isJotForm = (e.origin.indexOf("jotform") > -1) ? true : false;
                                    if (isJotForm && "contentWindow" in iframe && "postMessage" in iframe.contentWindow) {
                                        var urls = { "docurl": encodeURIComponent(document.URL), "referrer": encodeURIComponent(document.referrer) };
                                        iframe.contentWindow.postMessage(JSON.stringify({ "type": "urls", "value": urls }), "*");
                                    }
                                };
                                window.isPermitted = function (originUrl, whitelisted_domains) {
                                    var url = document.createElement('a');
                                    url.href = originUrl;
                                    var hostname = url.hostname;
                                    var result = false;
                                    if (typeof hostname !== 'undefined') {
                                        whitelisted_domains.forEach(function (element) {
                                            if (hostname.slice((-1 * element.length - 1)) === '.'.concat(element) || hostname === element) {
                                                result = true;
                                            }
                                        });
                                        return result;
                                    }
                                }
                                if (window.addEventListener) {
                                    window.addEventListener("message", handleIFrameMessage, false);
                                } else if (window.attachEvent) {
                                    window.attachEvent("onmessage", handleIFrameMessage);
                                }
                            </script>
                        </div>
                        <div v-else>
                            <p>No Lunch/Snack Option Selected</p>
                        </div>
                        <v-btn class="mr-4"
                               type="submit"
                               :disabled="radioGroup == ''"
                               color="secondary"
                               @click="getBalance(); e6 = 4">
                            Complete Payment
                        </v-btn>
                        <v-btn class="mr-4"
                               color="accent"
                               @click="e6 = 1;">
                            back
                        </v-btn>
                    </v-card>
                </v-stepper-content>
                <v-stepper-step :complete="e6 >= 4" step="4">
                    Your Lunch/Snack Purchase is Complete!
                </v-stepper-step>



            </v-stepper>

        </v-layout>
    </v-container>
</template>

<script>
    const UPDATE_CHILD = `
        mutation updateChild($myChild: ID!, $myApproved: ApprovedContactRelateToManyInput) {
            updateChild(id: $myChild, data: {approved_contact: $myApproved}) {
              id
            }
          }
    `;

    const UPDATE_BALANCE = `
        mutation updateBalance($myChild: ID!, $myBalance: Int) {
            updateChild(id: $myChild, data: {balence: $myBalance}) {
              id
            }
          }
    `;

    const GET_BALANCE = `
        query getBalance($myChild: ID!) {
            Child(where: {id: $myChild}) {
                        balence
            }
          }
    `;

    const UPDATE_PARENT = `
        mutation updateParent($myParent: ID!, $myApproved: ApprovedContactRelateToManyInput) {
            updateParent(id: $myParent, data: {approved_contact: $myApproved}) {
              id
            }
          }
    `;

    const GET_CHILDREN = `
        query Parent($myParent: ID!) {
            Parent(where: {id: $myParent}){
              child {
                id
                first_name
                last_name
                approved_contact {
                  first_name
                  last_name
                  relation
                }
                balence
              }
            }
          }
    `;

    const CREATE_APPROVED = `
        mutation addapprovedcontact($myfname: String, $mylname: String, $myphone: String, $myrelation: String,
                                    $mychild: ChildRelateToManyInput, $myparent: ParentRelateToManyInput) {
            createApprovedContact(data: {first_name: $myfname, last_name: $mylname, phone: $myphone,
                                         relation: $myrelation, child: $mychild, parent: $myparent}) {
              id
            }
          }
    `;

    function graphql(query, variables = {}) {
        return fetch(process.env.baseUrl + "/admin/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                variables,
                query,
            }),
        }).then(function (result) {
            return result.json();
        });
    }

    function getUser(data) {
        return fetch(process.env.baseUrl + "/api/auth/user/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data,
            }),
        }).then(function (result) {
            //console.log(result);
            return result.json();
        });
    }

    import { mapGetters } from "vuex";
    import materialCard from "~/components/material/AppCard";
    import {
        required,
        digits,
        email,
        max,
        regex,
        min,
        length,
    } from "vee-validate/dist/rules";
    import {
        extend,
        ValidationObserver,
        ValidationProvider,
        setInteractionMode,
    } from "vee-validate";
    import { StripeCheckout } from '@vue-stripe/vue-stripe';

    setInteractionMode("eager");
    extend("digits", {
        ...digits,
        message: "{_field_} needs to be {length} digits. ({_value_})",
    });
    extend("length", {
        ...length,
        message: "{_field_} needs to be in MM/DD/YYY Format. ({_value_})",
    });
    extend("required", {
        ...required,
        message: "{_field_} can not be empty",
    });
    extend("max", {
        ...max,
        message: "{_field_} may not be greater than {length} characters",
    });
    extend("regex", {
        ...regex,
        message: "{_field_} {_value_} does not match {regex}",
    });
    extend("email", {
        ...email,
        message: "Email must be valid",
    });
    extend("min", {
        ...min,
        message: "{_field_} must be at least {length} characters",
    });

    export default {
        layout: "parentsdashboard",
        data() {
            return {
                parentid: "",
                selectedChildID: "",
                childid: "",
                radioGroup: "",
                myphone: "",
                myemail: "",
                fname: "",
                lname: "",
                myrelation: '',
                approvedID: '',
                e6: 1,
                lunchSelect: '',
                lunchOptions: ["5 Days of Lunch", "20 Days of Lunch", "$20 Snack Credit"],
                tempBalance: 0,
                temp2: '',
            };
        },
        components: {
            materialCard,
            ValidationProvider,
            ValidationObserver,
            StripeCheckout,
        },

        methods: {
            async addApprovedContact() {
                const { data } = await graphql(CREATE_APPROVED, {
                    myfname: this.fname, mylname: this.lname, myrelation: this.myrelation, myphone: this.myphone,
                    mychild: { connect: { id: this.radioGroup } }, myparent: { connect: { id: this.myParentID } },
                });
                this.approvedID = data.createApprovedContact.id;
                console.log("Approved ID: " + this.approvedID +
                    " Child ID: " + this.radioGroup +
                    " Parent ID: " + this.myParentID);

                this.connectChild2Approved();

            },
            async connectChild2Approved() {
                await graphql(UPDATE_CHILD, {
                    myChild: this.radioGroup,
                    myApproved: { connect: { id: this.approvedID } },
                });

                this.connectParent2Approved();
            },
            determineBalance() {
                if (this.lunchSelect == "5 Days of Lunch") {
                    this.tempBalance = 25;
                } else if (this.lunchSelect == "20 Days of Lunch") {
                    this.tempBalance = 100;
                } else if (this.lunchSelect == "$20 Snack Credit") {
                    this.tempBalance = 20;
                } else {
                    console.log("Error in Lunch/Snack Option Selection");
                }
                console.log("determine balance ran");


            },
            async getBalance() {
                const { data } = await graphql(GET_BALANCE, {
                    myChild: this.radioGroup,
                });
                this.temp2 = (data.Child.balence + this.tempBalance);
                console.log("tempBalance = " + this.tempBalance);
                console.log("balence = " + data.Child.balence);
                console.log(this.temp2);
                this.updateBalance();
            },
            async updateBalance() {
                await graphql(UPDATE_BALANCE, {
                    myChild: this.radioGroup,
                    myBalance: this.temp2,
                });
            },
            async connectParent2Approved() {
                await graphql(UPDATE_PARENT, {
                    myParent: this.myParentID,
                    myApproved: { connect: { id: this.approvedID } },
                });
            },
            submit() {
                this.$refs.observer.validate();
            },
            printMe() {
                console.log(this.selectedChildID + " radioGroup= " + this.radioGroup);
            },

            clear() {
                this.name = "";
                this.phoneNumber = "";
                this.email = "";
                this.select = null;
                this.checkbox = null;
                this.$refs.observer.reset();
            },
        },
        computed: {
            ...mapGetters({
                user: "user/getUser",
                fullname: "user/getFullname",
            }),
        },
        async asyncData() {
            try {
                var token = await localStorage.getItem("auth_token");
                var responseUser = await getUser(token);
                var childrenData = await graphql(GET_CHILDREN, {
                    myParent: responseUser.decoded.id,
                });
                console.log(responseUser.decoded.id);
                return {
                    myParentID: responseUser.decoded.id,
                    myChildData: childrenData.data.Parent.child,

                };
            } catch (err) {
                console.log(err);
            }
        },
    };
</script>
