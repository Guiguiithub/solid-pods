<template>
  <header>
        <div class="container">
            <div class="row d-flex justify-content-between align-items-center">
                <h2 class="mb-0 col-6">VideoGames</h2>
                <div class="col-6 text-end">
                    <button type="button" class="btn btn-primary" name="btnLogin" id="btnLogin" @click="tryConnect()">Login</button>
                </div>
            </div>
        </div>
    </header>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <router-link :to="{name:'Home'}" class="nav-link active">Home</router-link>
      </li>
    </ul>
  <router-view/>
  <main>

  </main>
</template>

<script>
  import {loginToPod} from "@/services/connection.js";
    import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf";
  import router from "@/router/index.js";

    export default{
      data(){
        return {
        }
      },
      async mounted() {
      },
      methods:{
        tryConnect(){
          loginToPod()
        },
      }
    }
</script>
