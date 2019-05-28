<template>
  <div ref="page" class="about-page page-closed">
    <div class="content">
      <header>
        <TheLogo
          titleColor="#4B4B4B"
          subtitleColor="#4B4B4B"
          lineColor="#A8A8A8"
        />
        <NavigationButton
          title="Go back to the app"
          @click.native="togglePage"
        />
      </header>
      <div>
        <section class="about">
          <h3>ABOUT THIS APPLICATION</h3>
          <p>
            Accessing Campscapes: Inclusive Strategies for Using European
            Conflicted Heritage’ (iC-ACCESS) looks at traces of the 20th century
            mass violence and terror, as tangible reminders of the “age of
            extremes” and their present uses in (trans)national contexts. In
            most post-war European countries former Nazi internment camps have
            become icons of antifascist resistance and the Holocaust, and they
            have played a consistent role in postwar European memory of
            totalitarianism and genocide. In the Eastern European centre of the
            Holocaust and Communist terror, many former ‘terrorscapes’ are still
            contested spaces where consecutive internments of prisoners by
            occupying powers and authoritarian regimes transformed the victims
            of one event into the persecutors of another. This entanglement of
            remembering with forgetting and the silencing of competing
            narratives.
          </p>
        </section>
        <section class="team">
          <h3>TEAM</h3>
          <ul>
            <TeamMember
              name="Rob van der Laarse"
              position="Coordinator"
              organization="Universiteit van Amsterdam"
            />
            <TeamMember
              name="Dana Dolghin"
              position="Content"
              organization="Universiteit van Amsterdam"
            />
            <TeamMember
              name="Tijm Lanjouw"
              position="3D Modeller"
              organization="4DLab"
            />
            <TeamMember
              name="Maurice de Kleijn"
              position="Coordinator"
              organization="SPINLab"
            />
            <TeamMember
              name="Jitte Waagen"
              position="Project Lead"
              organization="4DLab"
            />
            <TeamMember
              name="Chris Lucas"
              position="Front-end"
              organization="SPINLab"
            />
            <TeamMember
              name="Bas Kortholt"
              position="Coordinator"
              organization="Herinneringscentrum Westerbork"
            />
            <TeamMember
              name="Erik van Zummeren"
              position="UI-Design"
              organization="."
            />
            <TeamMember
              name="Ivan Kisjes"
              position="Server Management"
              organization="Create"
            />
          </ul>
        </section>
        <section class="partners">
          <h3>PROJECT PARTNERS</h3>
          <ul>
            <li>
              <img
                :src="require('../assets/logo_partners/uva.png')"
                alt="Universiteit van Amsterdam"
              />
            </li>
            <li>
              <img
                :src="require('../assets/logo_partners/kampwesterbork.png')"
                alt="Herinneringscentrum Kamp Westerbork"
              />
            </li>
            <li>
              <img
                :src="require('../assets/logo_partners/hera.png')"
                alt="HERA"
              />
            </li>
            <li>
              <img
                :src="require('../assets/logo_partners/rotary.png')"
                alt="Rotary"
              />
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import TheLogo from "./TheLogo";
import NavigationButton from "./NavigationButton";
import TeamMember from "./TeamMember";

export default {
  name: "AboutPagePage",
  components: {
    TheLogo,
    NavigationButton,
    TeamMember
  },
  methods: {
    togglePage() {
      if (this.$refs.page.classList.contains("page-closed")) {
        this.$refs.page.classList.remove("page-closed");
        this.$refs.page.classList.add("page-open");
      } else {
        this.$refs.page.classList.remove("page-open");
        this.$refs.page.classList.add("page-closed");
      }
    }
  }
};
</script>

<style scoped>
.about-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  background-color: #ebebeb;
  color: #4a4a4a;
  visibility: hidden;
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-open {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.1s ease-out;
}

.page-closed {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.1s, opacity 0.1s ease-out;
}

.content {
  max-width: 97.625rem;
  /* max-height: 100vh;
  overflow: hidden; */
  padding: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2rem 0;
}

section {
  margin-bottom: 3rem;
}

.about p {
  column-count: 2;
  font-size: 1.3125rem;
}

.team ul {
  column-count: 3;
  max-width: 65rem;
  padding: 0;
}

.team li {
  display: inline-block;
  width: 100%;
}

.partners ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 50rem;
}

.partners li {
  padding: 1rem 2rem 1rem 0;
  width: 22rem;
}
</style>
