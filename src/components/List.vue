<template>
  <div>
    <v-toolbar dense id="inputbox">
      <v-textarea
         flat
         solo
         no-resize
         single-line
         :label="this.$t('list_add')"
         :hide-details="true"
         rows="1"
         v-model="new_entry"
         @keyup.enter="addNewEntry"
         @paste="onPaste"
         @focus="setListAction('')"
       >
      </v-textarea>

      <v-icon
       @click.stop="voiceRecognitionStart"
       v-if="voice_recognition"
       :disabled="!isVoiceRecognitionActive"
      >mic</v-icon>
    </v-toolbar>

    <v-list v-if="list_items.length" class="elevation-2 mt-4" id="thelist">
      <vuedraggable v-model="list_items" handle=".drag-handle">
        <transition-group appear name="listanim">
          <v-list-item v-for="(item, index) in list_items" v-bind:key="index">
            <v-list-item-action class="mr-3">
              <v-simple-checkbox color="grey" :value="item.taken" @input="toggleItemTaken(index)" :hide-details="true" />
            </v-list-item-action>

            <v-list-item-content @click.stop="toggleItemTaken(index)">
              <v-list-item-title :class="{ taken: item.taken, 'grey--text': item.taken }">
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>

            <transition appear name="fade">
              <v-list-item-action v-if="!isAction('')">
                <v-icon @click.stop="deleteItem(index, item.name)" v-if="isAction('elimina')">delete</v-icon>
                <v-icon @click.stop="editItem(index, item.name)" v-if="isAction('edit')">edit</v-icon>
                <v-icon class="drag-handle" v-if="isAction('riordina')">drag_handle </v-icon>
              </v-list-item-action>
            </transition>
          </v-list-item>
        </transition-group>
      </vuedraggable>
    </v-list>

    <v-dialog v-model="edit_dialog" max-width="400px">
      <v-form v-model="edit_valid" @submit.prevent="saveEditItem()">
       <v-card>
         <v-card-text>
           <v-text-field
            v-model="edit_item"
            :rules="editRules"
            :label="this.$t('list_edit_item')"
            autofocus
            required
            ></v-text-field>
         </v-card-text>
         <v-card-actions>
           <v-spacer />
           <v-btn color="primary" text type="submit">
             {{ $t('save') }}
           </v-btn>
         </v-card-actions>
       </v-card>
      </v-form>
     </v-dialog>

    <div id="emptylist-container" v-if="!list_items.length" class="body-1">
      <p class="text-center title grey--text text--darken-1">{{ $t('list_empty') }}</p>

      <div class="emptylist-tip emptylist-text">
        <img src="../assets/arrow.svg" alt="">
        <p>{{ $t('list_tip_write') }}</p>
      </div>

      <div class="emptylist-tip emptylist-voice" v-if="voice_recognition">
        <img src="../assets/arrow.svg" alt="">
        <p>{{ $t('list_tip_speak') }}</p>
      </div>
    </div>

    <ModalWin v-bind:open.sync="celebrate_modal_open">
      <SuccessIconAnimated />

      <div class="modal-title">{{ $t('list_completed') }}</div>
      <div class="modal-description">
        <v-btn class="mr-2" color="info" @click="(function(){})">{{ $t('close') }}</v-btn>
        <v-btn class="ml-2" color="info" @click="clearItems">{{ $t('list_clear') }}</v-btn>
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
import splitItems from '@/plugins/splitItems'

var recognition = null;

if ('webkitSpeechRecognition' in window){
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'it-IT';
}

export default {
  name: 'list',
  components: {
    vuedraggable,
    ModalWin,
    SuccessIconAnimated
  },
  watch:{
    $route(to, from){
      this.updatedComponent();
    }
  },
  mounted: function(){
    this.updatedComponent();
  },
  data: function(){
    return {
      new_entry: '',
      count_item_taken: 0,
      celebrate_modal_open: false,
      voice_recognition: recognition,
      mic_modal_open: false,
      mic_status: '',
      mic_substatus: '',
      mic_btn: '',
      edit_dialog: false,
      edit_item: '',
      edit_item_key: '',
      edit_valid: false,
      editRules: [
        v => !!v || this.$t('list_insert_item_name')
      ],
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
    updatedComponent(){
      if (!this.list){
        this.$router.push({ name: 'list_index' });
      }

      this.$store.commit({
        type: 'updateTitle',
        title: this.list_name
      });
    },
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

      gtag('event', 'addNewEntry', {
        'event_category': 'Lista',
        'event_label': this.new_entry
      });

      this.new_entry = '';
    },
    dispatchNotification: function(msg){
      this.$store.commit({
        type: 'notify',
        notification: msg
      });
    },
    addItems: function(voices){
      const entries = splitItems(this.$t('list_vocal_separator'), voices);

      entries.forEach(function(item){
        this.$store.commit({
          type: 'pushToList',
          id: this.id,
          item: item
        });
      }.bind(this));

      if (0 === entries.length)
        this.dispatchNotification(this.$t('list_added_none'));
      else if (1 === entries.length)
        this.dispatchNotification(this.$t('list_added_one', [ entries[0] ]));
      else
        this.dispatchNotification(this.$t('list_added_multi', [ entries.length ]));
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

      gtag('event', 'toggleItemTaken', {
        'event_category': 'Lista',
      });

      if (this.list_items.length === items_taken.length)
        this.celebrate();
    },
    clearItems: function(){
      this.$store.commit({
        type: 'clearItems',
        id: this.id
      });

      gtag('event', 'clearItems', {
        'event_category': 'Lista'
      });
    },
    deleteItem: function(item_key, name){
      this.$store.commit({
        type: 'deleteItem',
        id: this.id,
        item_key: item_key
      });

      gtag('event', 'deleteItem', {
        'event_category': 'Lista',
        'event_label': name,
      });

      this.dispatchNotification(this.$t('list_item_deleted', [ name ]));
    },
    editItem: function(item_key, name){
      this.edit_dialog = true;
      this.edit_item = name;
      this.edit_item_key = item_key;
    },
    saveEditItem: function(){
      if (!this.edit_valid)
        return;

      this.edit_dialog = false;

      this.$store.commit({
        type: 'editItem',
        id: this.id,
        item_key: this.edit_item_key,
        name: this.edit_item
      });

      gtag('event', 'saveEditItem', {
        'event_category': 'Lista',
        'event_label': this.edit_item
      });
    },
    setMicStatus:function(t_status, t_substatus, t_btn){
      this.mic_status = t_status ? this.$t(t_status) : '';
      this.mic_substatus = t_substatus ? this.$t(t_substatus) : '';
      this.mic_btn = t_btn ? this.$t(t_btn) : '';
    },
    voiceRecognitionStart: function(){
      // TODO autostop afeter 4 seconds of no input
      if (!this.voice_recognition)
        return;

      gtag('event', 'Mic', {
        'event_category': 'Lista',
        'event_label': 'voiceRecognitionStart'
      });

      this.mic_modal_open = true;

      if (!this.isVoiceRecognitionActive){
        this.setMicStatus('mic_offline', 'mic_offline_tip');
        return;
      }

      var start_timestamp = event.timeStamp;
      var final_transcript = '';

      this.voice_recognition.start();

      this.voice_recognition.onstart = function(){
        final_transcript = ''
        this.setMicStatus('mic_speak', '', 'mic_terminate');
      }.bind(this);

      this.voice_recognition.onerror = function(event) {
        if (event.error == 'no-speech')
          this.setMicStatus('mic_no_speech', 'mic_no_speech_tip');

        if (event.error == 'audio-capture')
          this.setMicStatus('mic_not_found', 'mic_not_found_tip');

        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            this.setMicStatus('mic_blocked');
          } else {
            this.setMicStatus('mic_denied');
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
          this.setMicStatus('mic_unsupported');
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

      gtag('event', 'Mic', {
        'event_category': 'Lista',
        'event_label': 'voiceRecognitionStop'
      });

      this.voice_recognition.stop();
    },
    celebrate: function(){
      if ('vibrate' in window.navigator)
        window.navigator.vibrate(400);

      this.celebrate_modal_open = true;

      this.$store.commit('recordCompletedList');

      gtag('event', 'Celebrate', {
        'event_category': 'Lista',
      });
    },
  },
}
</script>

<style>
.taken {
  text-decoration: line-through;
}

#thelist {
  border-radius: 8px;
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

#emptylist-container p:first-child {
  margin-top: 70px
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
  background: #2196f3;
  padding:0.5rem;
  border-radius: 0.4rem;
  color: #ddd;
  font-size:.9rem;
  line-height: 120%;
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

#inputbox {
  background:#fff;
}

#inputbox .v-toolbar__content {
  padding-left:0
}
</style>
