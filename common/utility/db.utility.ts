export class DbUtility {
  /**
   * Remove null fields from entity.
   * This is use on entity returned by DB query.
   * This entity contains null value also for fields that are not required un the interface definition.
   * @param entity entity to be cleaned
   * @returns entity cleaned
   */
  static removeNullFields = (entity: any): any => {
    Object.keys(entity).forEach((key: string) => {
      if (entity[key] == null) {
        delete entity[key];
      }
    });
    return entity;
  }; // removeNullFields

  /**
   * Remove null fields from entity list.
   * This is use on entity returned by DB query.
   * These entities contain null value also for fields that are not required un the interface definition.
   * @param entities entity list to be cleaned
   * @returns entity list cleaned
   */
  static removeNullFieldsList = (entities: any[]): any[] => {
    return entities.map((entity: any) => {
      return DbUtility.removeNullFields(entity);
    });
  }; // removeNullFieldsList
} // Db
