<template>
  <div>
    <v-textarea
       solo
       no-resize
       single-line
       background-color="#ffffff"
       label="Aggiungi alla lista della spesa"
       rows="1"
       v-model="new_entry"
       @keyup.enter="addNewEntry"
       @paste="onPaste"
       @focus="setListAction('')"
     >
     <template v-slot:append>
       <v-icon
        @click="voiceRecognitionStart"
        v-if="voice_recognition"
        :disabled="!isVoiceRecognitionActive"
       >mic</v-icon>
     </template>
    </v-textarea>

    <v-list v-if="list_items.length" class="elevation-2">
      <vuedraggable v-model="list_items" handle=".drag-handle">
        <transition-group appear name="listanim">
          <v-list-tile v-for="(item, index) in list_items" v-bind:key="index">
            <v-list-tile-action>
              <v-checkbox v-model="item.taken" color="grey"  @click.prevent.stop="toggleItemTaken(index)" :hide-details="true" />
            </v-list-tile-action>

            <v-list-tile-content @click.stops="toggleItemTaken(index)">
              <v-list-tile-title :class="{ taken: item.taken, 'grey--text': item.taken }">
                {{ item.name }}
              </v-list-tile-title>
            </v-list-tile-content>

            <transition appear name="fade">
              <v-list-tile-action v-if="!isAction('')">
                <v-icon @click.stop="deleteItem(index, item.name)" v-if="isAction('elimina')">delete</v-icon>
                <v-icon class="drag-handle" v-if="isAction('riordina')">drag_handle </v-icon>
              </v-list-tile-action>
            </transition>
          </v-list-tile>
        </transition-group>
      </vuedraggable>
    </v-list>

    <div id="emptylist-container" v-if="!list_items.length" class="body-1">
      <p class="text-xs-center title grey--text text--darken-1 mt-5">Niente da comprare</p>

      <div class="emptylist-tip emptylist-text">
        <img src="../assets/arrow.svg" alt="">
        <p>Inserisci nuovi articoli digitandoli...</p>
      </div>

      <div class="emptylist-tip emptylist-voice" v-if="voice_recognition">
        <img src="../assets/arrow.svg" alt="">
        <p>...oppure aggiungili a voce<br>
          separandoli fra loro con "e"</p>
      </div>
    </div>

    <ModalWin v-bind:open.sync="celebrate_modal_open">
      <SuccessIconAnimated />

      <div class="modal-title">Hai completato la spesa!</div>
      <div class="modal-description">
        <v-btn color="info" @click="">Chiudi</v-btn>
        <v-btn color="info" @click="clearItems">Svuota la lista</v-btn>
      </div>
    </ModalWin>

    <ModalWin v-bind:open.sync="mic_modal_open" @modal_closed="voiceRecognitionStop">
      <div id="mic-icon" v-if="isVoiceRecognitionActive"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg></div>
      <div class="modal-title">{{ mic_status }}</div>
      <div class="modal-description">{{ mic_substatus }}</div>
      <v-btn v-if="mic_btn">{{ mic_btn }}</v-btn>
    </ModalWin>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import ModalWin from './ModalWin.vue'
import SuccessIconAnimated from './SuccessIconAnimated.vue'

if ('webkitSpeechRecognition' in window){
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'it-IT';
} else {
  var recognition = null;
}

function updatedComponent(){
  if (!this.list){
    this.$router.push({ name: 'list_index' });
  }

  this.$store.commit({
    type: 'updateTitle',
    title: this.list_name
  });
}

export default {
  name: 'list',
  components: {
    vuedraggable,
    ModalWin,
    SuccessIconAnimated
  },
  mounted: updatedComponent,
  updated: updatedComponent,
  data: () => {
    return {
      new_entry: '',
      count_item_taken: 0,
      celebrate_modal_open: false,
      voice_recognition: recognition,
      mic_modal_open: false,
      mic_status: '',
      mic_substatus: '',
      mic_btn: '',
    }
  },
  computed: {
    id: function(){
      return this.$route.params.id;
    },
    list: function(){
      return this.$store.state.lists[this.id];
    },
    list_name: function(){
      return this.list.name;
    },
    list_items: {
      get() {
        return this.list.items;
      },
      set(updated_list) {
        this.$store.commit({
          type: 'updateListItems',
          id: this.id,
          list_items: updated_list,
        });
      }
    },
    isVoiceRecognitionActive: function(){
      return this.voice_recognition && this.isOnline;
    }
  },
  methods: {
    isAction(action){
      return action === this.$store.state.list_action;
    },
    setListAction: function(action){
      if (!this.isAction(action)){
        this.$store.commit({
          type: 'updateListAction',
          action: action
        });
      }
    },
    addNewEntry: function(){
      this.addItems(this.new_entry)
      this.new_entry = '';
    },
    dispatchNotification: function(msg){
      this.$store.commit({
        type: 'notify',
        notification: msg
      });
    },
    addItems: function(voices){
      var entries = voices.split(/\n|\se\s/).filter(function(voice){ return !!voice });

      entries.forEach(function(item){
        this.$store.commit({
          type: 'pushToList',
          id: this.id,
          item: item
        });
      }.bind(this));

      if (0 === entries.length)
        this.dispatchNotification('Nessun articolo aggiunto');
      else if (1 === entries.length)
        this.dispatchNotification('Nuovo articolo \''+ entries[0] +'\' aggiunto');
      else
        this.dispatchNotification(entries.length + ' articoli aggiunti');
    },
    onPaste: function(){
      setTimeout(function(){
        this.addNewEntry();
      }.bind(this), 200)

      return true;
    },
    toggleItemTaken: function(item_key){
      this.$store.commit({
        type: 'toggleItemTaken',
        id: this.id,
        item_key: item_key
      });

      var items_taken = this.list_items.filter(function(el){
        return !!el.taken;
      });

      if (this.list_items.length === items_taken.length)
        this.celebrate();
    },
    clearItems: function(){
      this.$store.commit({
        type: 'clearItems',
        id: this.id
      });
    },
    deleteItem: function(item_key, name){
      this.$store.commit({
        type: 'deleteItem',
        id: this.id,
        item_key: item_key
      });

      this.dispatchNotification('Articolo \''+ name + '\' eliminato');
    },
    setMicStatus:function(status, substatus, btn){
      this.mic_status = status;
      this.mic_substatus = substatus;
      this.mic_btn = btn;
    },
    voiceRecognitionStart: function(){
      // TODO autostop afeter 4 seconds of no input
      if (!this.voice_recognition)
        return;

      this.mic_modal_open = true;

      if (!this.isVoiceRecognitionActive){
        this.setMicStatus('Sei offline', 'Collegati ad internet per utilizzare la funzione vocale');
        return;
      }

      var start_timestamp = event.timeStamp;
      var final_transcript = '';

      this.voice_recognition.start();

      this.voice_recognition.onstart = function(){
        final_transcript = ''
        this.setMicStatus('Parla ora al microfono', '', 'Termina');
      }.bind(this);

      this.voice_recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          this.setMicStatus('No speech was detected', 'You may need to adjust your microphone settings');
        }
        if (event.error == 'audio-capture') {
          this.setMicStatus('No microphone was found', 'Ensure that a microphone is installed and that microphone settings are configured correctly');
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            this.setMicStatus('Permission to use microphone is blocked');
          } else {
            this.setMicStatus('Permission to use microphone was denied');
          }
        }
      }.bind(this);

      this.voice_recognition.onend = function() {
        if (!final_transcript)
          return;

        this.addItems(final_transcript);
        this.mic_modal_open = false;
      }.bind(this);

      this.voice_recognition.onresult = function(event){
        if (typeof(event.results) == 'undefined') {
          this.voice_recognition.onend = null;
          this.voice_recognition.stop();
          this.setMicStatus('Funzionalità non supportata');
          return;
        }

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal)
            final_transcript += event.results[i][0].transcript;
        }
      }.bind(this);
    },
    voiceRecognitionStop: function(){
      if (!this.voice_recognition)
        return;

      this.voice_recognition.stop();
    },
    celebrate: function(){
      if ('vibrate' in window.navigator)
        window.navigator.vibrate(400);

      this.celebrate_modal_open = true;
    },
  },
}
</script>

<style scoped>
.taken {
  text-decoration: line-through;
}

.v-list {
  border-radius: 8px;
}

.v-text-field__details {
  display: none!important
}

.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

/*-----------------------------------
 Mic modals
 -----------------------------------*/

@keyframes shadow-pulse {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
  }
}

#mic-icon {
  width: 100px;
  height: 100px;
  background: rgba(30, 144, 255, 0.6);
  border-radius: 50%;
  animation: shadow-pulse 1s infinite;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#emptylist-container {
  position: relative;
  padding:  0;
  color: rgb(236, 242, 245);
  overflow: hidden;
  height: 350px;
}

.emptylist-tip {
  width: 100%;
  overflow: hidden;
}

.emptylist-tip p,
.emptylist-tip img {
  position:absolute;
  display: inline-block;
}

.emptylist-tip p {
  background: #0694cc;
  padding:0.5rem;
  border-radius: 0.4rem;
  color: #ddd;
}

.emptylist-tip img {
  opacity: 0.1;
  -webkit-user-select:none;
  -webkit-touch-callout:none;
}

.emptylist-text p {top: 200px;left: 0;width: 170px;}

.emptylist-text img {
  /* width:100px; */
  height: 140px;
  transform: rotate(-30deg);
  top: 30px;
  left: -26px;
}

.emptylist-voice p {
  top: 270px;
  right: 0;
  width: 220px;
  text-align: right;
}

.emptylist-voice img {
  /* height:250px; */
  transform: rotate(73deg) scale(-1, 1);
  right: -30px;
  top: 25px;
}

.fade-enter-active {
  animation: animate-fade .3s;
}
.fade-leave-active {
  animation: animate-fade .3s reverse;
}

@keyframes animate-fade {
  from { opacity:0 }
  to { opacity:1 }
}

.listanim-enter-active, .listanim-leave-active {
  transition: opacity .3s, transform .3s;
}
.listanim-enter, .listanim-leave-to {
  opacity: 0;
  transform: translateY(-30%);
}
</style>
