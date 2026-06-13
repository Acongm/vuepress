<template>
  <Layout>
    <template #page-top>
      <AIAssistTrigger v-if="isDocPage" />
    </template>

    <template #page-bottom>
      <AIAssistLayout v-if="isDocPage" />
      <scriptx
        type="text/javascript"
        src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        async="true"
      ></scriptx>
      <div class="adsbygoogle-box">
        <ins
          class="adsbygoogle"
          style="display: block"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-6846038091720568"
          data-ad-slot="1554369026"
        />
      </div>
      <scriptx type="text/javascript">
        (adsbygoogle = window.adsbygoogle || []).push({});
      </scriptx>
    </template>
  </Layout>
</template>

<script>
import Layout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import AIAssistTrigger from '../../components/ai/AIAssistTrigger.vue'
import AIAssistLayout from '../../components/ai/AIAssistLayout.vue'
import { isDocumentPage } from '../../utils/is-document-page.js'

export default {
  components: {
    Layout,
    AIAssistTrigger,
    AIAssistLayout
  },

  computed: {
    isDocPage() {
      return isDocumentPage(this.$page)
    }
  }
}
</script>

<style lang="css">
.adsbygoogle-box {
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0.5rem 2.5rem;
  max-width: var(--content-width);
  text-align: center;
}

@media (max-width: 959px) {
  .adsbygoogle-box {
    padding: 0.5rem 2rem;
  }
}

@media (max-width: 419px) {
  .adsbygoogle-box {
    padding: 0.5rem 1.5rem;
  }
}
</style>
