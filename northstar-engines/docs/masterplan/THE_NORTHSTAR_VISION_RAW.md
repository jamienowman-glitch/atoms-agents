Northstar:

Factory 
Production line 
Assembly


So what we have been trying to build is the factory which we are almost done   in the factory. 

We are now almost at the point where this is where comes in. We need to produce the blueprints for the parts that come out of the production lines that the factory houses and this is where I see we need agent.MD and skills.MD for the factory workers

But even those parts that are produced by that team of agents are not the final product.  

Some of them, the muscle like the muscle, et cetera we will exposes individual products that the public can use with their own agents  

But the next step is the assembly line  

The assembly line will be and I started building this and you can have a look at it. It’s the wire frame canvas that I’ve started to build. Where I do have some of the UI elements built for that specific one because this is going to be at the moment and internal tool it is my internal assembly line for which I will be building and the repo that is called AgentFlow was built prematurely, but this is what the first internal app we are trying to build and that is going to be called agentflow


This will be where we will build individual flows of agents and then attach the other components that we have so far built in the factory two it through a series of graphlens 

t_system is my user where I will be setting default oozing what gets exposed to then the three types of modes that everything will run in 

SAAS | ENTERPRISE | LAB 

THE AIM IS TO GET EVERY SINGLE CONFIG AND EVERY SINGLE PRODUCTION LINE REPRESENTED IN A UI THAT I CAN USE UNDER T_system and then use the agent flow internal app to assemble into these still not finished product or not final product but to produce agent flows


Every flow needs to be scoped per tenant so the individual tenants can be using each one and they only get access to their own data

Every flow will belong to a surface. And each tenant will sign up per surface even if it’s only they’ve got one or they’ve got 1000 flows we will have these surfaces whereas one will be on marketing surface. Every flow the existing marketing will get access and also configured from central surface tenant space and that will then cascade outwards with something you can override at flow level 

I do have names for the surfaces. I’m not gonna put them here cause that then ends up getting carried on into the build.

But we will have a marketing surface we will have a health and energy surface. We will eventually having a finance surface.  


And we need to keep it open ending because I’d like to do more in the future


Graphlens

Graphlens is the way that we will atomically connect as nodes: agents or Agent frameworks as nodes or other agentflows as nodes 

THE BASE AGENT FLOW IS WHERE YOU WILL CHOOSE WHICH AGENT AND IT’S REALLY IMPORTANT THAT EACH OF THESE STAY ATOMIC AND IT SHOULD BE BUILT LIKE THAT THAT WE CAN LOAD EACH THING AND MIX AND MATCH THEM FOR EACH INDIVIDUAL AGENT

MANIFEST; what they specialise in

Persona: their human name and how they communicate to the user to the tenant if they opened the chat with them

Firearms licence: it is only at agent level that they are issued firearms licenses never at Node and never at scopes in connectors 

In scopes at the connectors level is where and the only place where we denote if it requires a firearms licence and which type of

In the agent flow we also have separate definitions per note of

Task: so what is the task that that node whether it’s a framework or agent what task they are meant to complete including floors and ceilings for something such as debate rounds

Artefact: artefact needs to remain separate and separate from persona et cetera. This is what is the document that they need to output to pass on to the next set of agents or or I like to call assets is what we produce and give to the tenant all delivered to a platform to be exposed to the public. 

Each framework and we must be able to load these atomically and I believe this is how we built it


Frameworks is the individual framework so crew AI autogen and this needs to remain open ended so I can create a production line of factory agents that will be able to go out and build and test and implement more frameworks

Every single framework, then individual individually must be able to come with a set of modes

So for example autogen can have a debate mode or round Robin and there’s a few more that I forgotten, but we need to be able to choose mode per framework we need to have these listed and loaded individually as well

And these need to be dropped down and tokens exposed two agents who will eventually run the assembly line. 

We also need to make sure we can we required a point different roles within the framework that each framework requires in the way that they require it

Graphs can. Also have blackboards which it keeps getting defined as the wrong thing in the whole system a blackboard is only in strictly only a scratch pad where the edge frameworks or agents can read and write artefacts to not a shit it’s a categorically not shared state for the entire graph


We do need a shared state for the entire graph as well, but that is a different feature than a blackboard 

These grass will be will be able to create all different types of logic on them to create super complex flows with agents or a framework as the nodes 

That then becomes the base where we apply everything else that we’ve built in the factory to each node or graph as a whole 


Safety: 

This is where we can denote whether a node needs strategy lock (hit) which must be able to be then in configuration that we will then group these together in categories and the tenant can decide whether they won’t strategy lock  not for that type of action

6-core-kpi

This can be fair again everything could be fair or the node 

And this guidance they are going to be targeting this these actions within each note to be landing within the floors and ceiling set by the six central KPI that the business is going to be set up to target   This allows each time a agent flow runs because these will be set to ultimately run silently in the background and will explain later about logging et cetera

But each run can adjust to target landing within those KPI and learn from each run what it did what the last one had as an effect on them and adjust accordingly   

Budgets 

Budget may sometimes mean money, but it might sometimes mean time or it might mean maximum per week   

And it always will have floors and ceilings in it 

3-wise-LLM

This is where we put in our risk panel that serve is allowing users to require less  strategy lock by running anything risky through a three different provider LLM call with a predisposed skeptic but a cold call trying to use the general risk currently the world has appetite for 

Contextlens 

This is super important so this is how does the agents and each agent flow make sure that the output is customised and personalised to their business and also their style we are not going to do brand guidelines   

So per node or per flow this is where you would access Nexus. Which we built one, but we must never use vertex again. It ran out of all my credit.

So we have, I think it’s only basic and we need to finish it built Nexus light 

But what this is is the per tenant and also globally updated for things like trends and best practices globally from t_system 

But it is a vector space that the user will be able to add to via Connect like Pinterest boards or YouTube playlists or podcast transcript to create a way of influencer system that is non-verbal from the client side from the tenant side so it’s getting style colours

It will be for KPI as well raw KPIs that we produce 

Because then you were able at that level to give a  rag enabled agent the task of pulling data and but never having to define which data points it should pull for this or how to interpret it you we lean on the current reasoning powers which is which are great of individual LLMs give them the vector space and enable them to decide what to pull in

And then context can be a runtime also web search or connector call 

Canvaslens 

So at each point you want to be showing the tenant or should be on a specific canvas this is where we decide which canvas of many collaborative canvas we will build the client sees as well as some they’re going to be more animated where they are the passenger or the viewer watching it   Think presentation canvas way we have the agents presenting an idea. 

Tokenlens 

Now this one is the core of how we’re gonna get everything moving and working each canvas will have a set of tokens normally these are the tokens that are exposed to this human through tools tool bars and apps   

We are aiming to move away from God, regenerate everything agent S with access to every control but per node and per agent within a framework so those need to be nodes nested inside frameworks we can expose certain sets of tokens and we have got we’ve got a major categorisation for our first steps of canvas defined

So that your colour specialist will be a separate agent than your copy and copy will be actually split depending into multiple agents 

And then you have your probably watch would be your manager or maybe not manager but layout agents   Who all would’ve been probably most of the time given a brief that from a agent that has no access to any of the tokens and a purely creative artist type agent who creates a vision first and then that’s translated into what we have to work with in our canvas

Each canvas is something that can be worked on in real time by both agents and humans 

It we are setting this up for power users 

And we have already got a way to show the work or an approximation of the work happening in real time   

If you’re moving elements around we want to see it moving on the screen. This gives confidence to use it and enables also for you to see when this is in full auto mode that you can come back and see the work that was done.   It’s moving away from pure conversational to having agents and being able to see the work of agent agent agent Happn in front of you.

The state needs to always be changed and it needs to. I think we have this already in this built transmitted from if the user makes a change the agents know the state of the canvas if the agent makes a change the human seized the state of the canvas everything is always should be saved like after each step and we undo and you know we can do up to a few undo steps what is that? What is normally customary 

Privacy lens

So this is where each note we just we can put whether it needs to be PII stripped but we also categorically need to make sure that PII is we have the engine for it is rehydrated on the way back down to the client cause otherwise I just end up with create an email campaigns Automatically but every time it says customer name in brackets here is not gonna be fucking worth anything. 

Deliverylens 

This is where we deliver and choose where each part can be delivered to sometimes multiple. 

So write to Shopify YouTube etc or notify tenant on slack/email in app etc plus which assets are stored in nexus 

But this also will denote what formats is it able to deliver in because you might want the same final webpage and maybe split into two lenses? Deliver this HTML only or to Shopify and find whether they’re gonna deliver it to Shopify as an embedded a full one block of HTML or we try to split it up between sections so that the users can then go back in and use the Shopify editor to make changes.

LOGLENS

So for every run we will have a logging view that obviously become more of a classic log of who did what when they did it which agent and we need to go detailed on this and this is where though I will choose I need to be able to choose here what I will see as T_system and what the tenants will see. 

So we always want to see which agent said what which agent wrote to which agent consumed what information so I can see that that’s been consumed and then which agent wrote to which agent what their thought processes because we’re gonna have multiple agents you need to have these steps Where you can scroll through each individual agent individually so it doesn’t take up your whole screen and see the timing because I want to see this is really gonna be for me Dee bugging but see the timing of if one agent started before it actually had the two reports but it started after one report it was waiting for. 

SubscriptionLens

This is where I would be able to gate features potentially or limits on the whole flow per subscription level I haven’t yet decided exactly how all of that will work out. That’s the final part.

There are more lenses and I probably can’t think of them all right now but the aim is to get the every part and every Lenz can be built but not just once repeatably and every lens and everything they need we can create those on a production line of course, except for a safety and something those are just saying Set.  But I can create production lines for many of them.  

And then I actually create a graph at these don’t need to sit on the same lenses but my factory graph where each floor is a different production line which I see actually women we won’t necessarily need always agents.md or skill.md but we might as well actually just standardise that into our flow and that’s the documents we create where necessary so we’re starting to standardise our approach but we’re adding our own safety on top

But yeah, I want to get to that point where we can have production lines built as on my graph system but also I do need to build the same structures in the repo so I can point the more feral agents that I get in ide or Jules they have everything they need to build and rebuild repeatedly the different elements

Then each flow that we build gets saved as these multiple lenses all stacked on top of each other so they become one object I can open again and edit or I can copy Peter that is a kickoff for a new one or then I can actually load flows as nodes and create a super flow and that is basically what would become an app. 

Individual flows people can pay to use once they can buy I don’t know. I haven’t decided yet flow packs where they can run flows individually or they can build by the full package superflow as apps 


Then the vision later on after this is I need to build some to test that the enterprise build really becomes more of you are dealing with a highly spec agent who can then have each flow or Superflow exposed to them as tools that they can use and that’s really what the enterprise build becomes it’s less fixed It’s more open but you have firearms that you can put in the right places.  Et cetera.


So that’s still there’s a lot of details I haven’t gone into here but many of which I will do later trying to give the vision and then the next step I think actually I think we might just stick together and work on this is actually to start looking at the reality and enabling me though each step to go further down and dive deeper into my definition of the reality of what exists literally almost almost filed by file at minimum concept by concept


There are and this needs to be open-ended, maybe in the future we have the same age flow but then I can add a smart watch Lens we can add more on top such as I think we’ll probably do something but I haven’t to find out yet on a guidance lens that guides you know it’s the little pop-ups the guide uses how to use each thing


So this is our target to create this first of all the definitions of which I think we should have already, but probably not in documents yet definitions of what each production line should be creating or variations of what they should be creating. Storing everything in registries so I can then pick a mix everything within the agent flow Builder and then once I’ve done that or we’ve got at least you know I’ve got at least enough to do a few different flows each flow at the end of the package and saved so I can either load it to edit later. Duplicate it as a starting point for another one. Or then we will be packaging multiple flows into really that’s what I would call a proper app.

And then apps flows are all sitting on different surfaces  with the tenant set at surface level and everything else happens on that surface

These are the gaps that I’ve been working on right now and think that I’m very aware I need to finish and the order in which I was finishing them often. I have to do stuff and start making something or at least doing one example of it to understand how to define it.

So number one right now I was finishing the major UI element for the supercanvas

Finishing the chat rail plus the tool surfaces either attached to the chat rail or to the floating tool bar 

Those are meant to become the generic versions of the chat rail and tool surfaces but then I’m using multi 21 which is the super UI element for our super canvas  as the way for me to separate tools to the different surfaces to understand what will sit where

I don’t need to do one or two more UI elements for the super canvas to make it pretty much ready for production or ready to at least then do the test step of plugging agents in

The next I had to do was look at the actual First collaborative canvas make sure that the desktop and mobile views are suitable and define how actually tools are done on desktop 

We were then going to be ready to bring all the elements together, put the chat trail onto the first collaborative canvas.  Get chat working as it should be.


Then it was to move to the agent flow and just the base graph and canvas lens and token lens 

Expose a few tokens from the collaborative canvas to a few separate agents and get a test of the user using the canvas agents using the canvas seeing in the real time interaction of what happens 

Not really pushing too much on the actual scoping of each individual agent to and how we actually pull together everything because that the behavioural side I will probably play around with different parts but we just wanted to get that working 


Then it becomes the part two actually start to build some production lines


Atoms-factory

The key here is and I believe I’ve created the definition. I have a list of the definition of the tokens needed for the super canvas.

The hot pot is categorising them making sure you’ve got everything and then making sure that each element expose them in the same way so they can sit into the toolbar and allocate to agents every time so this can really become a production line and I can set agents at a north level of List me every single UI element that Figma that Shopify that which ever app us s 

What’s the behaviour of them?

And out of the tokens that they’ve listed map them into our token Breakdown and then I can literally set agents to go and make lots of those Building the actual element the TS X I think it’s called exposing all of the controls to it in the right way, so we build fast elements for the super canvas

But then I want to create a production line for creating collaborative canvases

And that’s gonna be the challenge of First using a video editor canvas as the first test and Building then the blueprints for how to build a super canvas what remains each canvas that would have to answer just a few questions and map to everything and then I can set about listing 10-20 collaborative canvas being able to eat canvas will have to have tools mapped onto the tool regions keeping our defaults always the same if it’s all possible and that’s where I’ve seen you always will have typography and colour

Connectors 

Connectors where connect as I always call this is where we connect to outside services this year I think I’ve got it down but it’s making sure that each connector and it’s quitting that blueprint create a connector production line where each connector we create we expose scopes in exactly the way that I want to That we exposed as many as possible but then it’s per flow which ones get used and we attach firearms Licences two scopes at the first time we do a connector
