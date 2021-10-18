// import {MiddlewareSequence} from '@loopback/rest';

// export class MySequence extends MiddlewareSequence {}

import { inject } from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
  InvokeMiddleware
} from '@loopback/rest';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {

  @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject
  ) {}

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      //estableciendo los campos createdAt y updatedAt de acuerdo al metodo
      const date = this.getTimestamps();
        if(request.method === 'POST') args[0].createdAt = date;
        if(request.method === 'PUT') args[1].updatedAt = date;
      
      //mostrando el path de los request
      const msg = `METHOD: ${request.method}, PATH: ${request.originalUrl}`
      console.log(msg);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }

  private getTimestamps(){
    const dateCurrent = Date()
    return dateCurrent
  }
}

