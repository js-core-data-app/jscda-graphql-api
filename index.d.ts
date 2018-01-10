import { NappJS, NappJSModule } from 'nappjs';
export default class NappJSGraphqlAPI extends NappJSModule {
    postRegister(napp: NappJS): Promise<void>;
}
