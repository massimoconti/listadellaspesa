<template>
  <div>
    <v-bottom-sheet
      v-model="sheet"
      :persistent="true"
    >
      <v-card class="rate">
        <v-card-title class="title">
          La tua opinione è importante!
          <br>
          <v-icon>grade</v-icon>
          <v-icon>grade</v-icon>
          <v-icon>grade</v-icon>
          <v-icon>grade</v-icon>
          <v-icon>grade</v-icon>
        </v-card-title>

        <v-card-text class="text-md-center">
          Trovi l'app utile e vuoi condividere la tua opinione?
          Vorresti valutare Lista della Spesa su Google Play?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
              <v-flex xs6>
                <v-btn
                  color="primary"
                  text
                  @click="doRate()"
                >
                  Valuta l'App
                </v-btn>
              </v-flex>

              <v-flex xs6>
                <v-btn
                  color="secondary"
                  text
                  @click="dismiss()"
                >
                  No grazie
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  name: 'rate-modal',
  data(){
    return {
      sheet: false
    }
  },
  mounted(){
    /*
     condizioni di visibilità:
     - almeno 4 liste completate
     - utilizzo di almeno 2 settime
     - rate modal mai comparsa
     */
    let usg = this.$store.state.usage;
    let milliseconds_since_first_usage = Date.now()-usg.usg_ts_frst;
    let two_weeks_in_milliseconds = 1000*3600*24*15;
    let display = usg.cmpltd_tot >= 3 && !usg.ratemdl_n && milliseconds_since_first_usage >= two_weeks_in_milliseconds;

    if (display){
      setTimeout(function(){
        this.sheet = true
        gtag('event', 'shown', {
          'event_category': 'Rating'
        });
        this.$store.commit('recordRateModalShow');
      }.bind(this), 2000);
    }
  },
  methods: {
    doRate(){
      gtag('event', 'rate', {
        'event_category': 'Rating'
      });

      this.$store.commit('recordRateModalAccept');

      window.open('https://play.google.com/store/apps/details?id=com.massimoconti.listadellaspesa');
      this.close()
    },
    dismiss(){
      gtag('event', 'dismiss', {
        'event_category': 'Rating'
      });

      this.$store.commit('recordRateModalDismiss');

      this.close()
    },
    close(){
      this.sheet = false;
    }
  }
}
</script>

<style>
.rate {
  text-align: center;
}
.rate .title {
  display: block;
  margin-bottom: 0;
  padding-bottom: 0;
}
.rate .title .v-icon {
  color: rgb(220, 207, 10);
}
</style>
