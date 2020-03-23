module.exports = {
/*
  higherOrder: {
    _id: ObjectId("55c02b22d131551100f1f0da"),
    title: "Mastering ES6 higher-order functions for Arrays",
    md: "Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!\n\nHigher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!\n\n\n\Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!- -- Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!",
    meta: {
      activity: [
        { "action" : "publish",
          "utc" : ISODate("2015-09-15T18:39:06.632Z"), by: { _id: ObjectId("538bae591c67d1a4859d3333"), "name" : "Tiago Romero Garcia" },
          "commit" : "60f98aa4989c23b4fe06f9d711e77d16ca2f296b", _id: ObjectId("55f865ca272fbe11004303d7") },
        { _id: ObjectId("55c02b22d131551100f1f0db"),
          "utc" : ISODate("2015-08-04T03:01:54.731Z"),
          "action" : "createByAuthor", by: { "name" : "Tiago Romero Garcia", _id: ObjectId("5333e0fd66a6f999a4651100") } },
        { _id: ObjectId("55f47468529e2e11008268f5"),
          "action" : "updateHEAD",
          "utc" : ISODate("2015-09-12T18:52:24.805Z"), by: { _id: ObjectId("538bae591c67d1a4859d3333"), "name" : "Tiago Romero Garcia" } }
      ],
      "lastTouch" : {
        "action" : "publish",
        "by": { name: "Tiago Romero Garcia", _id: ObjectId("5333e0fd66a6f999a4651100") },
        "utc" : ISODate("2015-09-15T18:39:06.633Z")
      }
    },
    "tags" : [
      { _id: ObjectId("514825fa2a26ea020000001f"), "sort" : "0" },
      { _id: ObjectId("5181d0a966a6f999a465ecca"), "sort" : "1" },
      { _id: ObjectId("5181d0a966a6f999a465ec0a"), "sort" : "2" }
    ],
    subscribed: [
      { _id: ObjectId("55c02b22d131551100f1f0da"), userId: ObjectId("538bae591c67d1a4859d3381"), mail: "primary" },
      { _id: ObjectId("55dcb002c184971100440bbe"), userId: ObjectId("5524440217321011003de445"), mail: "julien.renaux@errtest.co" },
      { _id: ObjectId("55dd1e01f8279f110030ae39"), userId: ObjectId("527bd05966a6f999a465fb0c"), mail: "eric@testtest.me" },
      { _id: ObjectId("55ddc784f8279f110030d967"), userId: ObjectId("54f711888438550c00e98aa0"), mail: "rsmclaug@test.com" },
      { _id: ObjectId("55de2919a1d69b110076ffcb"), userId: ObjectId("533afd421c67d1a4859d2b28"), mail: "apolishc@test.com" },
      { _id: ObjectId("55df4340d77a1b1100809e9f"), userId: ObjectId("52d604b666a6f999a465ff3c"), mail: "jared.smith8@test.com" },
      { _id: ObjectId("55ea6e2a244a461100582db1"), userId: ObjectId("55ea653e244a461100582ccc"), mail: "off" },
      { _id: ObjectId("55efa1326882141100f368f5"), userId: ObjectId("5175efbfa3802cc4d5a5e6ed"), mail: "jk@airpair.com" },
      { _id: ObjectId("56265960f167c311002b76c4"), userId: ObjectId("52565e1666a6f999a465f9ba"), mail: "primary" },
      { _id: ObjectId("567bfcf5c9157b1100c723cd"), userId: ObjectId("567beece98972c110089b881"), mail: "primary" },
      { _id: ObjectId("56991f291097b51100521c18"), userId: ObjectId("56991e8a1097b51100521c10"), mail: "primary" },
      { _id: ObjectId("56ac324093cc061100b9d712"), userId: ObjectId("56ac31ca93cc061100b9d710"), mail: "primary" },
      { _id: ObjectId("55e90c2ad2b5001100b0fe35"), userId: ObjectId("55e90102d2b5001100b0fc79"), mail: "slynchtest13@gmail.com" }
    ],
    forkers: [
      { userId: ObjectId("54f711888438550c00e98aa0"), _id: ObjectId("55ddc500f8279f110030d88d") },
      { userId: ObjectId("55e90102d2b5001100b0fc79"), _id: ObjectId("55e90c2ad2b5001100b0fe35") }
    ],
    reviews: [
      { _id: ObjectId("55dcb002c184971100440bbe"), by: ObjectId("5524440217321011003de445"),
        said: "Good stuff!",
        votes:   [ { val: 1, by: ObjectId("538bae591c67d1a4859d3333"), _id: ObjectId("55dcb057c184971100440bd5") } ],
        replies: [ { said: "Thanks Julien for feedback and rating!", by: ObjectId("538bae591c67d1a4859d3333"), _id: ObjectId("55dcb061c184971100440bd7") } ],
        val: 4 },
      { _id: ObjectId("55dd1e01f8279f110030ae39"), by: ObjectId("527bd05966a6f999a465fb0c"),
        said: "Higher-order array functions are tricky to grasp, so seeing applicable code examples (particularly the same example re-used in different situations) makes the sophisticated code and syntax much more approachable.",
        votes:   [ { val: 1, by: ObjectId("538bae591c67d1a4859d3333"), _id: ObjectId("55ddedb0f8279f110030e465") }],
        replies: [ { said: "Thanks Eric for your super valuable feedback!", by: ObjectId("538bae591c67d1a4859d3333"), _id: ObjectId("55ddedc31241ac1100837e2c") } ],
        val: 5 },
      { _id: ObjectId("55ddc784f8279f110030d967"), by: ObjectId("54f711888438550c00e98aa0"),
        "updated" : ISODate("2015-08-26T14:05:35.685Z"),
        votes:   [ { by: ObjectId("538bae591c67d1a4859d3333"), val: 1, _id: ObjectId("55ddedb1f8279f110030e467") }],
        replies: [ { said: "Hey Rich! Thanks so much for your feedback! Great idea, I will add a synopsis :)", by: ObjectId("538bae591c67d1a4859d3333"), _id: ObjectId("55ddede01241ac1100837e3b") } ],
        said: "Great examples, Tiago.  This is a really strong follow up to your previous post.  Don't forget to add your synopsis section :)  I would add a prominent link to your previous post in the synopsis as well",
        val: 5 },
      { _id: ObjectId("55efa1326882141100f368f5"), by: ObjectId("549342348f8c80299bcc56c2"),
        "updated" : ISODate("2015-09-15T17:53:12.664Z"),
        replies: [{ said: "I think the syntax argument is not as strong as a function that returns a function demonstrating how one can be more DRY and reuse code.", _id: ObjectId("55efa4db6882141100f36998"), by: ObjectId("549342348f8c80299bcc56c2") } ],
        said: "(1) Nice ending to a great ready :p",
        val: 4 }
    ],
    history: {
      "updated" : ISODate("2015-09-15T18:39:06.633Z"),
      "created" : ISODate("2015-08-04T03:01:54.730Z"),
      "submitted" : ISODate("2015-08-25T17:31:22.008Z"),
      "published" : ISODate("2015-09-15T18:39:06.633Z"),
      "live": {
        "by": ObjectId("5333e0fd66a6f999a4651100"),
        "published" : ISODate("2015-09-15T18:39:06.633Z"),
        "commit" : "60f98aa4989c23b4fe06f9d711e77d16ca2f296b"
      }
    },
    by: {
      _id: ObjectId("5333e0fd66a6f999a4651100"),
      "avatar" : "//0.gravatar.com/avatar/5cac784a074b86d771fe768274f6860c",
      "bio" : "Technical Manager at @AvenueCode and Technical Leader at @Macys, heavily interested in cutting-edge front-end technologies. http://tiagorg.com",
      "name" : "Tiago Romero Garcia",
      links: {
        "ap" : "tiagorg"
      }
    },
    "assetUrl": "https://cloud.githubusercontent.com/assets/764487/9474195/82d6a242-4b35-11e5-87a0-43561850b53a.jpg",
    "htmlHead": {
      "ogUrl" : "https://www.airpair.com/javascript/posts/mastering-es6-higher-order-functions-for-arrays",
      "ogType" : "article",
      "ogTitle" : "Mastering ES6 higher-order functions for Arrays",
      "title" : "Mastering ES6 higher-order functions for Arrays",
      "description" : "Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!",
      "ogDescription" : "Higher-order functions are beautifully concise yet expressive when dealing with data. Elevate your functional programming skills by learning ES6 higher-order functions for Arrays!",
      "canonical" : "https://www.airpair.com/javascript/posts/mastering-es6-higher-order-functions-for-arrays",
      "ogImage" : "https://cloud.githubusercontent.com/assets/764487/9474195/82d6a242-4b35-11e5-87a0-43561850b53a.jpg"
    },
    "slug" : "mastering-es6-higher-order-functions-for-arrays",
    "github" : {
      "repoInfo" : {
        "author" : "tiagorg",
        "authorTeamName" : "mastering-es6-higher-order-functions-for-arrays-00f1f0da-author",
        "authorTeamId" : 1723144,
        "url" : "https://github.com/airpair/mastering-es6-higher-order-functions-for-arrays"
      }
    },
    "stats" : {
      "rating" : 4.714285714285714,
      "reviews" : 7,
      "comments" : 14,
      "forkers" : 2,
      "openPRs" : 0,
      "closedPRs" : 0,
      "acceptedPRs" : 0,
      "shares" : 0,
      "words" : 2606
    },
    "tmpl" : "default"
  },



  pubedArchitec: {
    _id: ObjectId("550106c2f1377c0c0051cbef"),
    title: "Scalable Architecture DR CoN: Docker, Registrator, Consul, Consul Template and Nginx",
    "md" : "Docker is great fun when you start building things by plugging useful containers together. Recently I have been playing with [Consul](https://www.consul.io/) and trying to plug things together to make a truly horizontally scalable web application architecture. Consul is a **Service Discovery and Configuration** application, made by [HashiCorp](https://hashicorp.com/) the people who brought us [Vagrant](http://www.maori.geek.nz/post/vagrant_with_docker_how_to_set_up_postgres_elasticsearch_and_redis_on_mac_os_x).\n\nPreviously I experimented using Consul by using SRV records ([described here](http://www.maori.geek.nz/post/docker_web_services_with_consul)) to create a scalable architecture, but I found this approach a little complicated, and I am all about simple. Then I found [Consul Template](https://hashicorp.com/blog/introducing-consul-template.html) which links to Consul to update configurations and restart application when services come up or go down. \n\nIn this post I will describe how to use Docker to plug together Consul, Consul Template, Registrator and Nginx into a truly scalable architecture that I am calling **DR CoN**. Once all plugged together, DR CoN lets you add and remove services from the architecture without having to rewrite **any** configuration or restart **any** services, and everything just works!\n\n<!-- FOLD -->\n\n## Docker\n\nDocker is an API wrapper around LXC (Linux containers) so will only run on Linux. Since I am on OSX (as many of you probably are) I have written a post about [how to get Docker running in OSX using boot2docker](http://www.maori.geek.nz/post/boot_2_docker_how_to_set_up_postgres_elasticsearch_and_redis_on_mac_os_x). This is briefly described below:\n\n```\nbrew install boot2docker\nboot2docker init  \nboot2docker up\n```\n\nThis will start a virtual machine running a Docker daemon inside an Ubuntu machine. To attach to the daemon you can run:\n\n```\nexport DOCKER_IP=`boot2docker ip`  \nexport DOCKER_HOST=`boot2docker socket` \n```\n\nYou can test Docker is correctly installed using:\n\n```\ndocker ps\n```\n\n## Build a very simple Web Service with Docker\n\nTo test the Dr CoN architecture we will need a service. For this, let create the simplest service that I know how (further described [here](http://www.maori.geek.nz/post/the_smallest_docker_web_service_that_could)). Create a file called `Dockerfile` with the contents:\n\n```\nFROM  python:3  \nEXPOSE  80  \nCMD [\"python\", \"-m\", \"http.server\"] \n```\n\nIn the same directory as this file execute:\n\n```\ndocker build -t python/server .\n```\n\nThis will build the docker container and call it `python/server`, which can be run with:\n\n```\ndocker run -it \\\n-p 8000:80 python/server\n```\n\nTo test that it is running we can call the service with `curl`:\n\n```\ncurl $DOCKER_IP:8000\n```\n\n## Consul\n\nConsul is best described as a service that has a DNS and a HTTP API. It also has many other features like health checking services, clustering across multiple machines and acting as a key-value store. To run Consul in a Docker container execute:\n\n\n```\ndocker run -it -h node \\\n -p 8500:8500 \\\n -p 8600:53/udp \\\n progrium/consul \\\n -server \\\n -bootstrap \\\n -advertise $DOCKER_IP \\\n -log-level debug\n```\n\nIf you browse to `$DOCKER_IP:8500` there is a dashboard to see the services that are registered in Consul.\n\nTo register a service in Consul's web API we can use `curl`:\n\n```\ncurl -XPUT \\\n$DOCKER_IP:8500/v1/agent/service/register \\\n-d '{\n \"ID\": \"simple_instance_1\",\n \"Name\":\"simple\",\n \"Port\": 8000, \n \"tags\": [\"tag\"]\n}'\n```\n\nThen we can query Consuls DNS API for the service using `dig`:\n\n```\ndig @$DOCKER_IP -p 8600 simple.service.consul\n```\n\n```\n; <<>> DiG 9.8.3-P1 <<>> simple.service.consul\n;; global options: +cmd\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 39614\n;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0\n\n;; QUESTION SECTION:\n;simple.service.consul.\t\tIN\tA\n\n;; ANSWER SECTION:\nsimple.service.consul.\t0\tIN\tA\t192.168.59.103\n\n;; Query time: 1 msec\n;; SERVER: 192.168.59.103#53(192.168.59.103)\n;; WHEN: Mon Jan 12 15:35:01 2015\n;; MSG SIZE  rcvd: 76\n```\n\nHold on, **there is a problem**, *where is the port of the service?* Unfortunately DNS A records do not return the port of a service, to get that we must check SRV records:\n\n```\ndig @$DOCKER_IP -p 8600 SRV simple.service.consul\n``` \n\n```\n; <<>> DiG 9.8.3-P1 <<>> SRV simple.service.consul\n;; global options: +cmd\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 3613\n;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1\n\n;; QUESTION SECTION:\n;simple.service.consul.\t\tIN\tSRV\n\n;; ANSWER SECTION:\nsimple.service.consul.\t0\tIN\tSRV\t1 1 8000 node.node.dc1.consul.\n\n;; ADDITIONAL SECTION:\nnode.node.dc1.consul.\t0\tIN\tA\t192.168.59.103\n\n;; Query time: 1 msec\n;; SERVER: 192.168.59.103#53(192.168.59.103)\n;; WHEN: Mon Jan 12 15:36:54 2015\n;; MSG SIZE  rcvd: 136\n```\n\nSRV records are difficult to use because they are not supported by many technologies.\n\nThe container [srv-router](https://github.com/vlipco/srv-router) can be \nused with Consul and nginx to route incoming calls to the correct services, as [described here](http://www.maori.geek.nz/post/docker_web_services_with_consul). However there is an easier way than that to use nginx to route to services.\n\n## Registrator\n\nRegistrator takes environment variables defined when a Docker container is started and automatically registers it with Consul. For example:\n\n```\ndocker run -it \\\n-v /var/run/docker.sock:/tmp/docker.sock \\\n-h $DOCKER_IP progrium/registrator \\\nconsul://$DOCKER_IP:8500\n```\n\nStarting a service with:\n \n```\ndocker run -it \\\n-e \"SERVICE_NAME=simple\" \\\n-p 8000:80 python/server\n```\n\nWill automatically add the service to Consul, and stopping it will remove it. This is the first part to plugin to DR CoN as it will mean no more having to manually register services with Consul.\n\n##Consul Template\n\n[Consul Template](https://hashicorp.com/blog/introducing-consul-template.html) uses Consul to update files and execute commands when it detects the services in Consul have changed. \n\nFor example, it can rewrite an nginx.conf file to include all the routing information of the services then reload the nginx configuration to load-balance many similar services or provide a single end-point to multiple services.\n\n**I modified the Docker container from https://github.com/bellycard/docker-loadbalancer for this example**\n\n```\nFROM nginx:1.7\n\n#Install Curl\nRUN apt-get update -qq && apt-get -y install curl\n\n#Download and Install Consul Template\nENV CT_URL http://bit.ly/15uhv24\nRUN curl -L $CT_URL | \\\ntar -C /usr/local/bin --strip-components 1 -zxf -\n\n#Setup Consul Template Files\nRUN mkdir /etc/consul-templates\nENV CT_FILE /etc/consul-templates/nginx.conf\n\n#Setup Nginx File\nENV NX_FILE /etc/nginx/conf.d/app.conf\n\n#Default Variables\nENV CONSUL consul:8500\nENV SERVICE consul-8500\n\n# Command will\n# 1. Write Consul Template File\n# 2. Start Nginx\n# 3. Start Consul Template\n\nCMD echo \"upstream app {                 \\n\\\n  least_conn;                            \\n\\\n  {{range service \\\"$SERVICE\\\"}}         \\n\\\n  server  {{.Address}}:{{.Port}};        \\n\\\n  {{else}}server 127.0.0.1:65535;{{end}} \\n\\\n}                                        \\n\\\nserver {                                 \\n\\\n  listen 80 default_server;              \\n\\\n  location / {                           \\n\\\n    proxy_pass http://app;               \\n\\\n  }                                      \\n\\\n}\" > $CT_FILE; \\\n/usr/sbin/nginx -c /etc/nginx/nginx.conf \\\n& CONSUL_TEMPLATE_LOG=debug consul-template \\\n  -consul=$CONSUL \\\n  -template \"$CT_FILE:$NX_FILE:/usr/sbin/nginx -s reload\";\n```\n**The repository for this file is [here](https://github.com/grahamjenson/DR-CoN).**\n\n*NOTE: the `\\n\\` adds a new line and escapes the newline for Docker multiline command*\n\nThis Docker container will run both Consul Template and nginx, and when the services change it will rewrite the nginx `app.conf` file, then reload nginx. \n\nThis container can be built with:\n\n```\ndocker build -t drcon .\n```\n\nand run with:\n\n```\ndocker run -it \\\n-e \"CONSUL=$DOCKER_IP:8500\" \\\n-e \"SERVICE=simple\" \\\n-p 80:80 drcon\n```\n\n`SERVICE` is query used to select which services to include from Consul. So this DR CoN container will now load balance across all services names `simple`.\n\n##All Together\n\nLets now plug everything together!\n\nRun Consul\n\n```\ndocker run -it -h node \\\n -p 8500:8500 \\\n -p 53:53/udp \\\n progrium/consul \\\n -server \\\n -bootstrap \\\n -advertise $DOCKER_IP\n```\n\nRun Registrator\n\n```\ndocker run -it \\\n-v /var/run/docker.sock:/tmp/docker.sock \\\n-h $DOCKER_IP progrium/registrator \\\nconsul://$DOCKER_IP:8500\n```\n\nRun DR CoN\n\n```\ndocker run -it \\\n-e \"CONSUL=$DOCKER_IP:8500\" \\\n-e \"SERVICE=simple\" \\\n-p 80:80 drcon\n```\n\nRunning `curl $DOCKER_IP:80` will return:\n\n```\ncurl: (52) Empty reply from server\n```\n\nNow start a service named `simple`\n\n```\ndocker run -it \\\n-e \"SERVICE_NAME=simple\" \\\n-p 8000:80 python/server\n```\n\nThis will cause:\n\n1. Registrator to register the service with Consul\n2. Consul Template to rewrite the nginx.conf then reload the configuration\n\nNow `curl $DOCKER_IP:80` will be routed successfully to the service.\n\nIf we then start another simple service on a different port with:\n\n```\ndocker run -it \\\n-e \"SERVICE_NAME=simple\" \\\n-p 8001:80 python/server\n```\n\nRequests will now be load balances across the two services.\n\nA fun thing to do is to run `while true; do curl $DOCKER_IP:80; sleep 1; done` while killing and starting simple services and see that this all happens so fast no requests get dropped.\n\n## Conclusion\n\nArchitectures like DR CoN are much easier to describe, distribute and implement using Docker and are impossible without good tools like Consul. Plugging things together and playing with Docker's ever more powerful tools fun and useful. Now I can create a horizontally scalable architecture and have everything just work.\n\n## Further Reading\n\n[The Docker Book](http://www.amazon.com/gp/product/B00LRROTI4/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00LRROTI4&linkCode=as2&tag=maor01-20&linkId=2QKZTS7EW7H2VZRM)\n\n[Original Post](http://www.maori.geek.nz/post/scalable_architecture_dr_con_docker_registrator_consul_nginx)",
    "tags" : [
      { _id: ObjectId("514825fa2a26ea020000002d"), "name" : "python" },
      { "name" : "docker", _id: ObjectId("5249f4d266a6f999a465f897") },
      { "name" : "NGINX", _id: ObjectId("5153f494d96db10200000011") },
      { "name" : "devops", _id: ObjectId("5358c8081c67d1a4859d2f18") }
    ],
    "forkers" : [ { _id: ObjectId("5501c781f1377c0c0051eae1"), userId: ObjectId("54de72d1bb6e680a0011c65c") },
                  { _id: ObjectId("55074f993c09dd0c009b5875"), userId: ObjectId("5175efbfa3802cc4d5a5e6ed") }
    ],
    "reviews" : [{ val: 5, said: "Great post, looks like a very useful tool!!!",  _id: ObjectId("550736f54c39d40c0099424c"), by: ObjectId("550736924c39d40c00994241") },
                 { val: 4, said: "Nice post. Would try to use Docker.", _id: ObjectId("550738774c39d40c0099427d"), by: ObjectId("5474a0138f8c80299bcc5243") },
                 { val: 5, said: "Looks good, good to hear a Maori perspective on Docker.", _id: ObjectId("550740e64c39d40c00994413"), by: ObjectId("550740ad4c39d40c0099440b"),
                   votes: [ { val: 1, _id: ObjectId("55074fd88dac8f0c00294a4b"), by: "5175efbfa3802cc4d5a5e6ed" } ] },
                 { val: 5, said: "Docker definitely sounds like a goer, thanks Graham!", _id: ObjectId("550742f94c39d40c00994475"), by: ObjectId("5507428d4c39d40c00994461") },
                 { val: 4, said: "I'm missing a chapter/comment for multiple hosts implementation :-(", _id: ObjectId("550d3c1710a0860c00ceacdb"), by: ObjectId("550d390b10a0860c00ceacb8") },
                 { val: 4, said: "Good post, \n\nbut at begin you say:\n>DR CoN lets you add and remove services from the architecture without having to rewrite any configuration or restart any services, and everything just works!\n\nand if I understand correctly nginx nevertheless reloaded and I'm a little disappointed because in case with websockets, opened websockets will be broken when nginx restarts.", _id: ObjectId("5572f3e5e18cb7110089263b"), by: ObjectId("5509dd449da6560c003aef55"),
                   votes: [ { val: 1, _id: ObjectId("55a350c03f96a1110001ee81"), by: "5175efbfa3802cc4d5a5e6ed" } ] }
    ],
    by: {
      _id: ObjectId("5501064cb2620c0c009bae70"),
      "name" : "Graham Jenson",
      "email" : "grahamjenson@maori.geek.nz",
      "avatar" : "//0.gravatar.com/avatar/7b9e77978853a15053b169abb710a787",
      "bio" : "I am a Developer who builds things, I blog over at http://www.maori.geek.nz/",
      "links" : {
        "ap" : "grahamjenson",
        "gh" : "grahamjenson",
        "tw" : "GrahamJenson",
        "gp" : "https://plus.google.com/+GrahamJenson"
      }
    },
    "assetUrl" : "https://maorigeek.s3.amazonaws.com/uploads/docker_whale.png_1411805342.jpg_1421807584.jpg",
    "slug" : "scalable-architecture-dr-con-docker-registrator-consul-consul-template-and-nginx",
    "github" : {
      "repoInfo" : {
        "author" : "grahamjenson",
        "authorTeamName" : "scalable-architecture-dr-con-docker-registrator-consul-consul-template-and-nginx-0051cbef-author",
        "authorTeamId" : 1358851,
        "url" : "https://github.com/airpair/scalable-architecture-dr-con-docker-registrator-consul-consul-template-and-nginx"
      }
    },
    "stats" : {
      "words" : 1192,
      "shares" : 0,
      "acceptedPRs" : 0,
      "closedPRs" : 0,
      "openPRs" : 0,
      "forkers" : 2,
      "comments" : 6,
      "reviews" : 6,
      "rating" : 4.5
    },
    "tmpl" : "default",
    "htmlHead" : {
      "ogImage" : "https://maorigeek.s3.amazonaws.com/uploads/docker_whale.png_1411805342.jpg_1421807584.jpg",
      "canonical" : "https://www.airpair.com/scalable-architecture-with-docker-consul-and-nginx",
      "ogDescription" : "In this post I will describe how to use Docker to plug together Consul, Consul Template, Registrator and Nginx into a truly scalable architecture that I am calling DR CoN. Once all plugged together, DR CoN lets you add and remove services from the architecture without having to rewrite any configuration or restart any services, and everything just works!",
      "title" : "Scalable Architecture DR CoN: Docker, Registrator, Consul, Consul Template and Nginx",
      "description" : "In this post I will describe how to use Docker to plug together Consul, Consul Template, Registrator and Nginx into a truly scalable architecture that I am calling DR CoN. Once all plugged together, DR CoN lets you add and remove services from the architecture without having to rewrite any configuration or restart any services, and everything just works!",
      "ogTitle" : "Scalable Architecture DR CoN: Docker, Registrator, Consul, Consul Template and Nginx",
      "ogType" : "article",
      "ogUrl" : "https://www.airpair.com/scalable-architecture-with-docker-consul-and-nginx"
    },
    "subscribed" : [
      { _id: ObjectId("550106c2f1377c0c0051cbef"), userId: ObjectId("5501064cb2620c0c009bae70"), mail: "grahamjenson@maori.geek.nz"},
      { _id: ObjectId("550736f54c39d40c0099424c"), userId: ObjectId("550736924c39d40c00994241"), mail: "dollar10boy@hotmail.com"},
      { _id: ObjectId("550738774c39d40c0099427d"), userId: ObjectId("5474a0138f8c80299bcc5243"), mail: "yehtechnologies@gmail.com"},
      { _id: ObjectId("550740e64c39d40c00994413"), userId: ObjectId("550740ad4c39d40c0099440b"), mail: "daniel.walmsley@gmail.com"},
      { _id: ObjectId("55074fd88dac8f0c00294a4b"), userId: ObjectId("5175efbfa3802cc4d5a5e6ed"), mail: "jk@airpair.com"},
      { _id: ObjectId("550742f94c39d40c00994475"), userId: ObjectId("5507428d4c39d40c00994461"), mail: "dunkthetyler@gmail.com"},
      { _id: ObjectId("550d3c1710a0860c00ceacdb"), userId: ObjectId("550d390b10a0860c00ceacb8"), mail: "contact@czerasz.com"},
      { _id: ObjectId("5572f3e5e18cb7110089263b"), userId: ObjectId("5509dd449da6560c003aef55"), mail: "infunt@gmail.com"},
      { _id: ObjectId("5501c781f1377c0c0051eae1"), userId: ObjectId("54de72d1bb6e680a0011c65c"), mail: "da@airpair.com" }
    ],
    "history" : {
      "created" : ISODate("2015-03-12T03:23:46.945Z"),
      "updated" : ISODate("2015-03-16T22:23:33.578Z"),
      "submitted" : ISODate("2015-03-12T04:05:46.709Z"),
      "published" : ISODate("2015-03-16T21:39:54.136Z"),
      "live" : {
          "published" : ISODate("2015-03-16T22:23:33.578Z"), by: ObjectId("5175efbfa3802cc4d5a5e6ed"),
          "commit" : "4321756fa5c0cfeeaab27b73273a577a609913fe"
      }
    },
    "meta" : {
      "lastTouch" : {
        "action" : "publish",
        "utc" : ISODate("2015-03-16T22:23:33.578Z"),
        by: { _id: ObjectId("5175efbfa3802cc4d5a5e6ed"), "name" : "Jonathon Kresner" }
      },
      "activity" : [
        { _id: ObjectId("550106c2f1377c0c0051cbf0"),
          "utc" : ISODate("2015-03-12T03:23:46.945Z"),
          "action" : "createByAuthor",
          by: { "name" : "Graham Jenson", _id: ObjectId("5501064cb2620c0c009bae70") } },
        { _id: ObjectId("550757e58dac8f0c00294bbe"),
          "commit" : "4321756fa5c0cfeeaab27b73273a577a609913fe",
          "touch": {
            "action" : "publish",
            "utc" : ISODate("2015-03-16T22:23:33.578Z"),
            by: { _id: ObjectId("5175efbfa3802cc4d5a5e6ed"), "name" : "Jonathon Kresner" } }
        }
      ]
    }
  },






  submittedToFork: {
//     _id: ObjectId("56b364161346cb837eb19ab4"),
    // "title" : "Fork up already",
    // "md" : "Welcome to your post. Highlighted elements are inconsistent with our [authoring guidelines](https://www.airpair.com/authoring-guide)\n\n> Posts should start with a 30-50 word `blockquote` summary. Delete the above sentence and rewrite this blockquote when know what your post is covering.\n\n## 1. AirPair Editor Tips\n\n### 1.1 The preview pane\n\nAs you make change the preview pane will update.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor. The longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n\nThe longer your post, the less frequently it will refresh. To immediately show the latest changes, click anywhere - *i.e. blur* - out of the editor.\n",
    // "github" : {
    //   "repoInfo" : {
    //     "authorTeamId" : "1917165",
    //     "url" : "https://github.com/airpair/fork-up-already",
    //     "authorTeamName" : "fork-up-already-7eb19ab4-author",
    //     "author" : "jkresner"
    //   }
    // },
    // "forkers" : [],
    // "reviews" : [],
    // "publishHistory" : [],
    // "editHistory" : [],
    // "updated" : ISODate("2016-02-04T14:45:42.000Z"),
//     "created" : ISODate("2016-02-04T14:45:42.139Z"),
//     "meta" : {
//         "notes" : [],
//         "lastTouch" : { by: {
//                 "name" : "Jonathon Kresner", _id: ObjectId("5175efbfa3802cc4d5a5e6ed")
//             }, _id: ObjectId("56b364c080b3668a7e2252b5"),
//             "action" : "submit"
//         },
//         "activity" : [
//           { _id: ObjectId("56b364161346cb837eb19ab3"),
//                 "action" : "create", by: {
//                     "name" : "Jonathon Kresner", _id: ObjectId("5175efbfa3802cc4d5a5e6ed")
//                 }
//             },
//           { _id: ObjectId("56b3642f1346cb837eb19ab6"),
//                 "action" : "editDraft", by: {
//                     "name" : "Jonathon Kresner", _id: ObjectId("5175efbfa3802cc4d5a5e6ed")
//                 }
//             },
//             {
//                 "action" : "updateDetails", _id: ObjectId("56b364481346cb837eb19ab7"), by: { _id: ObjectId("5175efbfa3802cc4d5a5e6ed"),
//                     "name" : "Jonathon Kresner"
//                 }
//             },
//           { _id: ObjectId("56b364c080b3668a7e2252b5"),
//                 "action" : "submit", by: {
//                     "name" : "Jonathon Kresner", _id: ObjectId("5175efbfa3802cc4d5a5e6ed")
//                 }
//             }
//         ]
//     },
//     "tags" : [{
//       "sort" : 0,
//       _id: ObjectId("5149dccb5fc6390200000013") }
//     ],
//     by: {
//       "name" : "Jonathon Kresner",
//       "bio" : "AirPair.com Founder",
//       userId: ObjectId("5175efbfa3802cc4d5a5e6ed"),
//       "avatar" : "https://avatars.githubusercontent.com/u/979542?v=3"
//     },
//     "stats" : {
//       "words" : 1
//     },
//     "assetUrl" : "https://static.airpair.com/img/author/example2.jpg",
//     "submitted" : ISODate("2016-02-04T14:48:32.302Z"),
//     "slug" : "fork-up-already",
//     "htmlHead": {
//       "ogImage": "https://static.airpair.com/img/author/example2.jpg"
//     }
  },


  meanAIR: {
//     _id: ObjectId("5664fc66760815e9036b9c43"),
//     "title" : "meanAIR",
//     "assetUrl" : "https://static.airpair.com/img/author/example2.jpg",
//     "md" : "> [meanair](https://www.airpair.com/meanair) (pronouced \"MEAN-er\" or \"MEAN-air\")\nis a framework for building **+ testing** node.js apps.\n\n## MEANAIR DOCS\n\n## Overview\n\n...\n\n\n## SCREAM\n\n\n...\n\n\n## Shared\n\n...\n\n## Model\n\n...\n\n\n## Build\n\n...\n\n\n## Middleware\n\n...\n\n## Server\n\n### Config\n\n**Background**\n\nThis is really cool.\n\n#### defaults\n#### app & app.json\n#### env & dotEnv\n\n### Instrumentation\n\nComing soon.\n\n### Entended Express app\n\nComing soon.\n\n### Wrappers\n\nComing soon.\n\n### Logic and DataHelpers\n\nComing soon.\n\n## Auth\n\nComing soon.\n\n- - -\n\nMore soon\n\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.\nFiller to submit for review and setup missing link.",
//     "github" : {
//         "repoInfo" : {
//             "authorTeamId" : "1865644",
//             "url" : "https://github.com/airpair/meanair-docs",
//             "authorTeamName" : "meanair-docs-036b9c43-author",
//             "author" : "jkresner"
//         }
//     },
//     "forkers" : [
//         {
//             "avatar" : "https://avatars.githubusercontent.com/u/11258947?v=3",
//             "gh" : "jkyahoo",
//             "email" : "jkresner@yahoo.com.au",
//             "name" : "Jonny Yahoo",
//             userId: ObjectId("55286c4ecc4f2d1100232518"), _id: ObjectId("56b41ef781a45433987b5c1b")
//         }
//     ],
//     "reviews" : [
//         {
//             "type" : "post-survey-inreview", _id: ObjectId("56b41b801f8ae8b397e72056"),
//             "votes" : [],
//             replies: [],
//             "questions" : [
//                 {
//                     "answer" : 5,
//                     "prompt" : "How do you rate this post?",
//                     "key" : "rating",
//                     "idx" : 0, _id: ObjectId("56b41b801f8ae8b397e72058")
//                 },
//                 {
//                     "answer" : "Amaze balls",
//                     "prompt" : "Overall comment",
//                     "key" : "feedback",
//                     "idx" : 1, _id: ObjectId("56b41b801f8ae8b397e72057")
//                 }
//             ], by: {
//                 "avatar" : "https://avatars.githubusercontent.com/u/11258947?v=3",
//                 "name" : "Jonny Yahoo", _id: ObjectId("55286c4ecc4f2d1100232518")
//             }
//         },
//         { _id: ObjectId("56b420c681a45433987b5c22"),
//             "type" : "post-survey-inreview",
//             "votes" : [],
//             replies: [],
//             "questions" : [
//                 { _id: ObjectId("56b420c681a45433987b5c24"),
//                     "idx" : 0,
//                     "key" : "rating",
//                     "prompt" : "How do you rate this post?",
//                     "answer" : 4
//                 },
//                 { _id: ObjectId("56b420c681a45433987b5c23"),
//                     "idx" : 1,
//                     "key" : "feedback",
//                     "prompt" : "Overall comment",
//                     "answer" : "Blahasdjfasdfasdf"
//                 }
//             ], by: { _id: ObjectId("564941e4184a811100ee8c69"),
//                 "name" : "Air PairOne",
//                 "avatar" : "https://avatars.githubusercontent.com/u/11261012?v=3"
//             }
//         },
//         {
//             "type" : "post-survey-inreview", _id: ObjectId("56b4217581a45433987b5c29"),
//             "votes" : [],
//             replies: [],
//             "questions" : [
//                 {
//                     "answer" : 5,
//                     "prompt" : "How do you rate this post?",
//                     "key" : "rating",
//                     "idx" : 0, _id: ObjectId("56b4217581a45433987b5c2b")
//                 },
//                 {
//                     "answer" : "asdfadfasdfadsf",
//                     "prompt" : "Overall comment",
//                     "key" : "feedback",
//                     "idx" : 1, _id: ObjectId("56b4217581a45433987b5c2a")
//                 }
//             ], by: {
//                 "avatar" : "https://avatars.githubusercontent.com/u/10833613?v=3",
//                 "name" : "Air Pair", _id: ObjectId("52ad320166a6f999a465fdc5")
//             }
//         }
//     ],
//     "publishHistory" : [],
//     "editHistory" : [],
//     "updated" : ISODate("2015-12-07T03:26:30.000Z"),
//     "created" : ISODate("2015-12-07T03:26:30.706Z"),
//     "meta" : {
//         "lastTouch" : { by: {
//                 "name" : "Air Pair", _id: ObjectId("52ad320166a6f999a465fdc5")
//             }, _id: ObjectId("56b4217581a45433987b5c28"),
//             "action" : "postreview"
//         },
//         "activity" : [
//             {
//                 "action" : "create", _id: ObjectId("5664fc66760815e9036b9c42"), by: { _id: ObjectId("5175efbfa3802cc4d5a5e6ed"),
//                     "name" : "Jonathon Kresner"
//                 }
//             },
//             {
//                 "action" : "editDraft", _id: ObjectId("5665165c8cdc409c053cb5c8"), by: { _id: ObjectId("5175efbfa3802cc4d5a5e6ed"),
//                     "name" : "Jonathon Kresner"
//                 }
//             },
//             { _id: ObjectId("5665166c8cdc409c053cb5c9"),
//                 "action" : "updateDetails", by: {
//                     "name" : "Jonathon Kresner", _id: ObjectId("5175efbfa3802cc4d5a5e6ed")
//                 }
//             },
//             {
//                 "action" : "editDraft", _id: ObjectId("566517938cdc409c053cb5ca"), by: { _id: ObjectId("5175efbfa3802cc4d5a5e6ed"),
//                     "name" : "Jonathon Kresner"
//                 }
//             },
//             { _id: ObjectId("566517d38cdc409c053cb5cb"),
//                 "action" : "editDraft", by: {
//                     "name" : "Jonathon Kresner", _id: ObjectId("5175efbfa3802cc4d5a5e6ed")
//                 }
//             },
//             {
//                 "action" : "submit", _id: ObjectId("56651c4ad75a49f6056503bf"), by: { _id: ObjectId("5175efbfa3802cc4d5a5e6ed"),
//                     "name" : "Jonathon Kresner"
//                 }
//             },
//             { _id: ObjectId("56b41b801f8ae8b397e72055"),
//                 "action" : "postreview", by: {
//                     "name" : "Jonny Yahoo", _id: ObjectId("55286c4ecc4f2d1100232518")
//                 }
//             },
//             {
//                 "action" : "fork", _id: ObjectId("56b41ce6cc39d3d4976e9e35"), by: { _id: ObjectId("55286c4ecc4f2d1100232518"),
//                     "name" : "Jonny Yahoo"
//                 }
//             },
//             { _id: ObjectId("56b41ef681a45433987b5c1a"),
//                 "action" : "fork", by: {
//                     "name" : "Jonny Yahoo", _id: ObjectId("55286c4ecc4f2d1100232518")
//                 }
//             },
//             {
//                 "action" : "postreview", _id: ObjectId("56b420c681a45433987b5c21"), by: { _id: ObjectId("564941e4184a811100ee8c69"),
//                     "name" : "Air PairOne"
//                 }
//             },
//             { _id: ObjectId("56b4217581a45433987b5c28"),
//                 "action" : "postreview", by: {
//                     "name" : "Air Pair", _id: ObjectId("52ad320166a6f999a465fdc5")
//                 }
//             }
//         ],
//     },
//     "tags" : [
//         {
//             "sort" : 0, _id: ObjectId("514825fa2a26ea0200000028")
//         }
//     ],
//     by: {
//         "name" : "Jonathon Kresner",
//         "bio" : "AirPair.com Founder",
//         userId: ObjectId("5175efbfa3802cc4d5a5e6ed"),
//         "avatar" : "https://avatars.githubusercontent.com/u/979542?v=3"
//     },
//     "submitted" : ISODate("2015-12-07T05:42:34.386Z"),
//     "slug" : "meanair-docs",
//     "htmlHead" : {
//         "ogImage" : "https://static.airpair.com/img/author/example2.jpg"
//     },
//     "stats" : {
//         "acceptedPRs" : 0,
//         "closedPRs" : 0,
//         "openPRs" : 0,
//         "words" : 431,
//         "forkers" : 1,
//         "comments" : 4,
//         "reviews" : 3,
//         "rating" : 4.666666666666667
//     }
  },

  AngOnRails: {
    "_id" : ObjectId("5433f9cf6e79ab0b00f21bb0"),
    "assetUrl" : "https://imgur.com/U0cKZFa.png",
    "by" : {
        "_id" : ObjectId("52c5c74466a6f999a465feb6"),
        "name" : "Jason Swett",
        "email" : "jason@benfranklinlabs.com",
        "avatar" : "https://avatars.githubusercontent.com/u/680813?v=3",
        "bio" : "Jason Swett is author of AngularOnRails.com, AngularJS mentor at Thinkful, and principal of AngularJS/Rails consultancy Ben Franklin Labs.",
        "links" : {
            "ap" : "jasonswett",
            "gh" : "jasonswett",
            "so" : "http://stackoverflow.com/users/199712/jason-swett",
            "in" : "AdS2PoBjHJ",
            "tw" : "JasonSwett",
            "gp" : "https://plus.google.com/116435474655494140703"
        }
    },
    "md" : "## 1 Introduction\n\n### 1.1",
    "slug" : "authentication-with-angularjs-and-ruby-on-rails",
    "tags" : [
        {
            "_id" : ObjectId("5192296b66a6f999a465f2ce"),
            "name" : "ruby-on-rails-4",
            "slug" : "ruby-on-rails-4"
        },
        {
            "_id" : ObjectId("5149dccb5fc6390200000013"),
            "name" : "AngularJS",
            "slug" : "angularjs"
        }
    ],
    "title" : "How to Set Up Authentication with AngularJS and Ruby on Rails",
    "htmlHead" : {
        "title" : "How to Set Up Authentication with AngularJS and Ruby on Rails",
        "canonical" : "http://www.airpair.com/ruby-on-rails/posts/authentication-with-angularjs-and-ruby-on-rails",
        "ogType" : "article",
        "ogTitle" : "How to Set Up Authentication with AngularJS and Ruby on Rails",
        "ogVideo" : null,
        "ogUrl" : "http://www.airpair.com/ruby-on-rails/posts/authentication-with-angularjs-and-ruby-on-rails",
        "description" : "The intricacies of implementing authentication using Rails and Angular are discussed, including topics such as testing, security, etc.",
        "ogDescription" : "The intricacies of implementing authentication using Rails and Angular are discussed, including topics such as testing, security, etc.",
        "ogImage" : "https://imgur.com/U0cKZFa.png"
    },
    "history" : {
        "created" : ISODate("2014-10-07T14:33:51.543Z"),
        "updated" : ISODate("2015-02-10T03:43:28.166Z"),
        "published" : ISODate("2014-10-17T00:20:17.331Z"),
        "live" : {
            "published" : ISODate("2014-10-17T00:20:17.331Z"),
            "by" : ObjectId("54207c948f8c80299bcc4840")
        }
    },
    "meta" : {
        "lastTouch" : {
            "action" : "updateByAuthor",
            "utc" : ISODate("2015-02-10T03:43:28.166Z"),
            "by" : {
                "_id" : ObjectId("545a6aac8f8c80299bcc4ec6"),
                "name" : "Ellen Dudley"
            }
        },
        "activity" : [
            {
                "action" : "updateByAuthor",
                "utc" : ISODate("2015-02-10T03:43:28.166Z"),
                "_id" : ObjectId("54d97e609f30880a00be45f8"),
                "by" : {
                    "_id" : ObjectId("545a6aac8f8c80299bcc4ec6"),
                    "name" : "Ellen Dudley"
                }
            }
        ]
    },
    "stats" : {
      "reviews" : 0,
      "comments" : 0,
      "forkers" : 0,
      "words" : 4667
    }
  },

  bestWP: {
    "_id" : ObjectId("5437ec252350a70b00422add"),
    "assetUrl" : "https://i.imgur.com/CoVN8LJ.jpg",
    "by" : {
        "_id" : ObjectId("532c3cde1c67d1a4859d28fb"),
        "name" : "Micah Wood",
        "email" : "micah@wpscholar.com",
        "avatar" : "https://0.gravatar.com/avatar/387c3953bd06646261614f724d997719",
        "bio" : "Micah Wood is an enterprise-level WordPress developer who is passionate about continuously improving, working with awesome people, and sharing what he has learned.",
        "links" : {
            "gh" : "woodent",
            "bb" : "wpscholar",
            "tw" : "wpscholar",
            "gp" : "https://plus.google.com/105219968724909401837"
        }
    },
    "md" : "When I think of [best practices](http://vip.wordpress.com/documentation/best-practices/) in WordPress development, ",
    "slug" : "best-practices-and-patterns-for-wordpress-developers",
    "tags" : [
        {
            "_id" : ObjectId("514825fa2a26ea0200000010"),
            "name" : "wordpress",
            "slug" : "wordpress"
        }
    ],
    "title" : "Best Practices and Patterns for WordPress Developers",
    "htmlHead" : {
        "title" : "Best Practices and Patterns for WordPress Developers",
        "canonical" : "http://www.airpair.com/wordpress/posts/best-practices-and-patterns-for-wordpress-developers",
        "ogType" : "article",
        "ogTitle" : "Best Practices and Patterns for WordPress Developers",
        "ogImage" : "http://i.imgur.com/CoVN8LJ.jpg",
        "ogVideo" : null,
        "ogUrl" : "http://www.airpair.com/wordpress/posts/best-practices-and-patterns-for-wordpress-developers",
        "description" : "WordPress expert Micah Wood describes some best practices and patterns that both coders and themers alike should follow when working with the platform.",
        "ogDescription" : "WordPress expert Micah Wood describes some best practices and patterns that both coders and themers alike should follow when working with the platform."
    },
    "history" : {
        "created" : ISODate("2014-10-10T14:24:37.803Z"),
        "updated" : ISODate("2014-10-15T23:47:25.302Z"),
        "published" : ISODate("2014-10-12T14:18:37.288Z"),
        "live" : {
            "published" : ISODate("2014-10-12T14:18:37.288Z"),
            "by" : ObjectId("5175efbfa3802cc4d5a5e6ed")
        }
    },
    "stats" : {
        "reviews" : 0,
        "comments" : 0,
        "forkers" : 0,
        "words" : 3620
    }
  },


  hosts: {
    "_id" : ObjectId("543e9ec7edf8190b005c0360"),
    "assetUrl" : "https://i.imgur.com/alPhzhH.jpg",
    "by" : {
        "_id" : ObjectId("53da92ff8f8c80299bcc3cf0"),
        "name" : "Daniel Rice",
        "email" : "danielricecodes@gmail.com",
        "avatar" : "https://0.gravatar.com/avatar/0eef0bd73c24fb96a704ba0648d9f967",
        "bio" : "Daniel Rice has been making apps using Ruby on Rails since 2008 (version 1.2) and has been a professional Ruby on Rails consultant since 2010.  Today, Daniel is CTO at Medicare Pathfinder and a co-founder and software developer at Ruby on Rails development and consulting agency LD Studios.",
        "links" : {
            "ap" : "dlrice",
            "gh" : "danielricecodes",
            "so" : "http://stackoverflow.com/users/1930295/danielricecodes",
            "in" : "n6FzNfgXPy",
            "tw" : "danielricecodes",
            "gp" : "109034387987573112118"
        }
    },
    "md" : "## 1 Introduction \n\nIn the mid-to-late 1990ss and early 2000s, choosing a hosting provider was a relatively straightforward process. You would find a service that could host your PHP application, your MySQL database, and provide shell access. \n\nFast forward to 2014 and the landscape has changed dramatically. There are dozens of framework choices, multiple database options (schemas optional), and a dizzying array of cloud providers that all do Something-as-a-Service. \n \nAt least when we're working with Ruby on Rails, there are some hosting providers available to us that have been at this for a while and can make the process of getting code online a breeze. While it's still possible to host your app the old fashioned way, there are many more ways to host a Ruby on Rails application and they each come with their own advantages, tradeoffs, and price points.\n\nIn this article, we’re going to explore some of the Ruby on Rails hosting providers I have deployed applications on and discuss the steps required to get your application up and running. If you’re a Ruby on Rails developer already, then you'll gain valuable insight into which hosting provider could work best for your project. If you're not on a Rails stack, read anyway...you might just discover something new!\n\n\n### 1.1 A few things first\n\nBefore I start, I do want to clarify a few things first. The time I took to setup and provision an account (login, password, billing, confirming my email, etc.) is not included in any of the metrics below. In fact, I already had an account at all of them.\n\n## 2 Amazon AWS\n\nAmazon AWS provides a group of cloud computing services, all provided over the internet and run together within the Amazon cloud. In my experience, the most commonly used Amazon AWS offerings for hosting a Ruby on Rails app are EC2, S3, and SES. Respectively, these provide the virtual server, permanent cloud storage of assets such as uploaded images, and email delivery services. Spinning up an Amazon EC2 instance is very straightforward and done through the Amazon AWS Console directly. \n \n![EC2](https://s3.amazonaws.com/airpair-blog-post/rails-hosting-comparison/EC2_Management_Console_and_images_and_public.jpg)\n\nHere you can see that setting up an image with Ruby 2.1 and PostgreSQL 9.3 is as simple as pushing the blue “Select” button. You have to work through a couple of subsequent menus, but if you stick with the defaults you can have the image up and running in less than 5 minutes. Its really fast and convenient. \n\nAdditionally, you can start off with a free tier image (“t2.micro”) and just use that to bootstrap your application without running up a large tab. A benefit of using the Amazon cloud with your Ruby on Rails application is that the Amazon platform is very stable and scalable. Additionally, there is great Ruby community support. To add SES or S3 support to your Ruby on Rails application, the gems are usually named with the convention “aws-<service name here>”, e.g. “aws-ses” and “aws-s3”. There are other Ruby gems such as CarrierWave and Fog that can also provide support for Amazon S3 as well, but most of the time the gem you need can be found using the convention above. \n\n![Image Created](https://s3.amazonaws.com/airpair-blog-post/rails-hosting-comparison/EC2_Management_Console.jpg)\n\nGetting the application up and running from this point is outside of the scope of the article since there are several ways to accomplish this, and frankly I don’t want to start a flame war over the various ways this can be done. If you need additional help getting your application up and running on Amazon EC2, please refer to the EC2 documentation. \n\n\n## 3 Digital Ocean\n\nDigital Ocean is a provider of Virtual Private Servers (VPS) that all run over the internet. Their claim to fame is the speed of their images (they were one of the first, if not the first, providers to offer SSD images) and their assertion that it only takes 55 seconds to setup an SSD cloud server.  Once you get through the initial account setup process (username and password, billing setup) this isn’t too far off from reality. Creating a “Droplet” is an easy as following the wizard, selecting the options you need, and pushing a giant, green “Create Droplet” button. \n\n**Step 1:** Select an image size.\n\n![Step 1](https://s3.amazonaws.com/airpair-blog-post/rails-hosting-comparison/DigitalOcean_Control_Panel.jpg)\n\n**Step 2:** Select Region and Settings.\n\n![Step 2](https://s3.amazonaws.com/airpair-blog-post/rails-hosting-comparison/DigitalOcean_Control_Panel+2.jpg) \n\n**Step 3:** Select the Applications tab, and select the pre-fabricated Ruby on Rails image. If you prefer to use a different web server, you can always start an image from scratch (Linux Distributions tab) and customize your image just the way you want. \n\n![Step 3](https://s3.amazonaws.com/airpair-blog-post/rails-hosting-comparison/DigitalOcean_Control_Panel+3.jpg) \n\nStep 4: Press the Green Button!\n\n![Step 4](https://s3.amazonaws.com/airpair-blog-post/rails-hosting-comparison/DigitalOcean_Control_Panel+4.jpg) \n\nOnce the server provisioning process finishes, you get an email with your root password and IP address. The total time to work through this process can easily take less than 1 minute, unless you are new to the Droplet provisioning process and wanted to read and learn about all the options. Either way, the process to create and provision a server is all done through Digital Ocean’s minimalistic and intuitive web interface. \n\nIn summary, Digital Ocean is a great choice if you need to retain a high level of control over your Virtual Servers. Digital Ocean offers very affordable prices, but it does not have a free starter account. In order to use Digital Ocean, your team should have a DevOps engineer who understands Environment Management, Unix Systems, and is very comfortable on the command line.  The platform does impose monthly bandwidth limits however, so its possible you will have to upgrade your system to a high tier just to deal with sporadic traffic spikes. \n\n## 4 Heroku\n\nHeroku is a “full service” Platform-as-a-Service offering that automates all of the requirements and infrastructure required to run and host a web application. In many ways, this platform is built for teams who do not wish or need to manage their own infrastructure. That said, because Heroku is a fully-automated PaaS, it does impose a particular workflow but for the most part the Heroku conventions are not terribly intrusive and are easy to follow. \n\nDeploying a Rails application to Heroku is facilitated via pushing from a Git repository, at which point the Heroku platform will receive the code being sent to it, wrap it up into a deployable package, or “Slug”, and run the code inside of any number of web threads that you specify. The deploy process itself can vary in length, but by and large they all complete in under 5 minutes. In most cases, it only takes about 30 seconds to deploy a Rails application on Heroku. This shouldn’t be a terribly surprising number because Heroku was purpose-built for deploying Rails apps. As the company grew it offered support for more and more technologies, but Heroku has always been optimized for Ruby on Rails development from the get-go.\n\nSo how does Heroku compare to other hosting providers?\n\nHeroku stands out because of how easy it is to get your application up and running. The platform provides an intuitive and easy to use web interface, but it also provides a developer friendly command line interface. Heroku charges on a per-thread basis, meaning that you pay only for the amount of server resources that you use, billed in chunks.  There are no bandwidth limitations with Heroku, so even if your application gets mentioned on Hacker News or another major news source, you can quickly scale and know that the platform will not shut you down or charge overage fees. Heroku, simply stated, takes the hassle out of development. \n\nNext I want to show you how little hassle there is. Creating a new server on Heroku takes seconds, and is all done via a command line tool, the Heroku Toolkit.\n\nJust run `heroku create` and you will get a randomly named server instance created for you.\n\n<!--code lang=bash linenums=true-->\n\n    $ heroku create\n      Creating fierce-sierra-3668... done, stack is cedar\n      http://fierce-sierra-3668.herokuapp.com/ | git@heroku.com:fierce-sierra-3668.git\n      Git remote heroku added\n\nAll in all - about 5 seconds. Voilà.\n\nThe next step is to deploy your Rails app, which is done merely by pushing your code to the Git remote that was automatically configured for you. Just run `git push –u heroku master` and deploy your app. Done. \n\nThe first time takes significantly longer than subsequent deploys, but this is because Heroku is installing all of your dependencies, including Rails, for the first time. This process has gotten much faster over time, but just be patient and it will finish. At this stage, you probably need to provision a database and add some additional Add-ons to get your application fully running. To finish configuring your application, please refer to the [Heroku Documentation]( https://devcenter.heroku.com/articles/getting-started-with-rails4)\n\n## 5 Engine Yard\n\nUp until now, we have been taking a look at the pros and cons of several Ruby on Rails hosting providers, some of which are what I would consider to be nearly polar opposites of each other. \n\nOn one hand, you have Amazon and Digital Ocean. Both of whom require hands on knowledge of Unix but allow you to have complete control over your platform. Heroku on the other hand, is a fully automated PaaS but you give up the ability to customize the environment as you see fit. \n\nEngine Yard, however, fits right in the middle between the two poles of the Ruby on Rails hosting spectrum. Engine Yard started off as a Rails hosting site, in many ways just like Heroku did, but Engine Yard brought something unique to the table: Engine Yard monitors your app for you. That’s right: Engine Yard doesn’t just automate a could platform for you, they offer world class support as well. I’m not talking platform support...all hosting providers keep their platform running. Engine Yard goes one step farther and will literally help you out with your application and your application’s code. They’re the ones up at 3am monitoring your application. \n\nIn many ways, they allow you to have the best of both worlds: A fully automated PaaS (facilitated with their engine_yard gem and the `ey` command line tool), with the sysadmin and DevOps support you need to confidently grow and scale over time. All of this does come at a price however, starting at around $80 a month. This is the most expensive monthly plan we’ve encountered so far, but if your app needs to be reliable and up 24x7, the $80/mth investment is worth the peace of mind. Also, it’s a lot cheaper than hiring your own sysadmin and DevOps engineers.  \n\n## 6 TL;DR Comparison\n\n### 6.1 Amazon\n\n**Benefits:** Scalable, starts off free, easy to provision new servers.\n\n**Tradeoffs:** Need to know basic Unix administration to be able to work with the platform successfully. For a startup, this usually entails hiring a Ruby on Rails developer with Amazon AWS DevOps experience as well. This can make your talent search more nuanced, and therefore more difficult.\n\n**Pricing:** Hard to argue with the free tier, but it does ramp up as resource requirements grow. Each service has its own pricing structure, so sometimes it can be hard to figure out how much Amazon EC2 and a bunch of other services will really cost each month until the invoices start to arrive.\n\n**Ease of Use:** Medium to Advanced.\n\n### 6.2 Digital Ocean\n\n**Benefits:** Easy to deploy a prebuilt image for various development stacks. Not necessarily a Rails-specific company. Offers a lot more flexibility and freedom to tweak the environment to your needs. Great for migrating on-premise systems into the cloud. All SSDs means the images run very quickly.   \n\n**Tradeoffs:** Requires sysadmin and DevOps experience. Bandwidth limits. \n\n**Pricing:** Very affordable, but no free tier. Starts at $5/month and goes up from there.\n\n**Ease of Use:** Advanced\n\n### 6.3 Heroku\n\n**Benefits:** A new server instance can be created in as little as 10 seconds using the Heroku command line interface. Deploys are automated using Git Push. Add-ons make it easy to provision additional resources and infrastructure, such as Redis, Solr, or log analysis. Free when using a single web thread.  No bandwidth limits!\n\n**Tradeoffs:** Must deploy with Git. Scaling is not automated.\n\n**Pricing:** Starts off free, but can grow quickly with the number of threads and Add-ons required to run the application.\n\n**Ease of Use:** Beginner \n\n### 6.4 Engine Yard\n\n**Benefits:** Easy to create a Ruby on Rails application server that runs in the cloud. Started as a Rails-only hosting company, so brings a lot of experience to the table. Can provide application-specific support and 24x7 monitoring. Provide developer friendly tools, such as the “engineyard” RubyGem.  \n\n**Tradeoffs:** Requires sysadmin and DevOps experience. Bandwidth limits. \n\n**Pricing:** Starts at around $80/month and goes up from there depending on server resources and support requirements.\n\n**Ease of Use:** Medium\n\n## 7 Conclusion \n\nWhile we only mentioned four hosting providers, the truth is that there are many more to choose from. I apologize in advance if I didn't mention your hosting provider, but if there are any that I failed to mention by all means please let me know your preference in the comments below. As far as my approach for selecting which hosting provider goes, it boils down to two things really: what is the most cost effective choice and which choice complements the existing engineering team the best. By approaching a hosting provider and keeping those two things in mind, it's hard to go wrong. ",
    "slug" : "rails-host-comparison-aws-digitalocean-heroku-engineyard",
    "tags" : [
        {
            "_id" : ObjectId("514825fa2a26ea020000002f"),
            "name" : "Rails",
            "slug" : "ruby-on-rails"
        }
    ],
    "title" : "Rails Hosts: Amazon AWS vs. Digital Ocean vs. Heroku vs. Engine Yard",
    "htmlHead" : {
        "title" : "Rails Hosts: Amazon AWS vs. Digital Ocean vs. Heroku vs. Engine Yard",
        "canonical" : "http://www.airpair.com/ruby-on-rails/posts/rails-host-comparison-aws-digitalocean-heroku-engineyard",
        "ogType" : "article",
        "ogTitle" : "Rails Hosts: Amazon AWS vs. Digital Ocean vs. Heroku vs. Engine Yard",
        "ogImage" : "https://i.imgur.com/alPhzhH.jpg",
        "ogVideo" : null,
        "ogUrl" : "http://www.airpair.com/ruby-on-rails/posts/rails-host-comparison-aws-digitalocean-heroku-engineyard",
        "description" : "Rails developer Daniel Rice compares the relative merits of four of the biggest developer-focused hosting companies.",
        "ogDescription" : "Rails developer Daniel Rice compares the relative merits of four of the biggest developer-focused hosting companies."
    },
    "history" : {
        "created" : ISODate("2014-10-15T16:20:23.296Z"),
        "updated" : ISODate("2014-11-19T00:09:29.934Z"),
        "published" : ISODate("2014-10-20T02:44:37.916Z"),
        "live" : {
            "published" : ISODate("2014-10-20T02:44:37.916Z"),
            "by" : ObjectId("54207c948f8c80299bcc4840")
        }
    },
    "stats" : {
        "reviews" : 0,
        "comments" : 0,
        "forkers" : 0,
        "words" : 2230
    }
  },

  js11: {
    "_id" : ObjectId("543ef1f1bbf73d0b002d9dcf"),
    "assetUrl" : "https://i.imgur.com/okRnWh3.jpg",
    "by" : {
        "_id" : ObjectId("541feeb78f8c80299bcc482d"),
        "name" : "Dave Sag",
        "email" : "davesag@gmail.com",
        "avatar" : "https://avatars.githubusercontent.com/u/387098?v=3",
        "bio" : "Dave Sag is a seasoned software development professional with over 18 years of Javascript experience. In this article, he discusses some of the most common mistakes that both new and veteran JavaScript developers make.",
        "links" : {
            "ap" : "davesag",
            "gh" : "davesag",
            "so" : "http://stackoverflow.com/users/917187/dave-sag",
            "in" : "Gv1WctfGid",
            "tw" : "davesag",
            "gp" : "https://plus.google.com/+DaveSag"
        }
    },
    "md" : "## Introduction\n\nJavaScript is a mature language whose ubiquity",
    "slug" : "eleven-mistakes-developers-javascript",
    "tags" : [
        {
            "_id" : ObjectId("514825fa2a26ea020000001f"),
            "name" : "javascript",
            "slug" : "javascript"
        }
    ],
    "title" : "The Top 11 Mistakes That JavaScript Developers Make",
    "htmlHead" : {
        "title" : "Eleven mistakes that Javascript developers make",
        "canonical" : "http://www.airpair.com/javascript/posts/eleven-mistakes-developers-javascript",
        "ogType" : "article",
        "ogTitle" : "Eleven mistakes that Javascript developers make",
        "ogVideo" : null,
        "ogUrl" : "http://www.airpair.com/javascript/posts/eleven-mistakes-developers-javascript",
        "description" : "JavaScript expert Dave Sag discusses some of the most common mistakes that both new and veteran JavaScript developers make.",
        "ogDescription" : "JavaScript expert Dave Sag discusses some of the most common mistakes that both new and veteran JavaScript developers make.",
        "ogImage" : "https://i.imgur.com/okRnWh3.jpg"
    },
    "history" : {
        "created" : ISODate("2014-10-15T22:15:13.007Z"),
        "updated" : ISODate("2014-11-19T00:22:59.945Z"),
        "published" : ISODate("2014-10-16T03:12:03.027Z"),
        "live" : {
            "published" : ISODate("2014-10-16T03:12:03.027Z"),
            "by" : ObjectId("54207c948f8c80299bcc4840")
        }
    },
    "stats" : {
        "reviews" : 0,
        "comments" : 0,
        "forkers" : 0,
        "words" : 3608
    }
  }
*/
}
