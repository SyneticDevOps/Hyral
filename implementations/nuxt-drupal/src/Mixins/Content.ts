import { Resource } from '@hyral/core';
import { ResourceMixin as RootResourceMixin, CollectionMixin as RootCollectionMixin } from '@hyral/vue';
import { IHyralEntity } from '../__types__';

/**
 * Uses ResourceMixin and CollectionMixin to fetch the required drupal data automatically
 * @param hyralService: string
 *
 * @requires source? Resource | Collection
 */
export default function ContentMixin(hyralService: string): any {
  return {
    mixins: [RootResourceMixin, RootCollectionMixin],
    props: {
      source: {
        type: Object,
        default(this: IHyralEntity): Resource<unknown> | undefined {
          if (this.$options.propsData?.root) {
            const { route } = this.$store.state.druxtRouter;
            return new Resource(route.props.uuid, route.props.type);
          }

          return undefined;
        },
      },
    },
    watch: {
      source: {
        handler(this: IHyralEntity) {
          if (this.collection) {
            this.loadCollection();
          }
          if (this.resource) {
            this.loadResource();
          }
        },
        deep: true,
      },
    },
    data(): { hyralService: string } {
      return {
        hyralService,
      };
    },
  };
}