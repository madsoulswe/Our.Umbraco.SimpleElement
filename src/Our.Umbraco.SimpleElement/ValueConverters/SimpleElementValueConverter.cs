using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.PropertyEditors;
using Umbraco.Web.PropertyEditors.ValueConverters;

namespace Our.Umbraco.SimpleElement.ValueConverters
{
    public class SimpleElementValueConverter : PropertyValueConverterBase
    {
        private readonly NestedContentSingleValueConverter _nestedContentSingleValueConverter;

        public SimpleElementValueConverter(
            NestedContentSingleValueConverter nestedContentSingleValueConverter)
        {
            _nestedContentSingleValueConverter = nestedContentSingleValueConverter;
        }

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        { 
            return PropertyCacheLevel.Element;
        }

        public override bool IsConverter(IPublishedPropertyType propertyType) => propertyType.EditorAlias == "Our.Umbraco.SimpleElement";

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType) => typeof(IPublishedElement);

        public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {
            var jsonObject = JsonConvert.DeserializeObject<JObject>((string)inter);

            if (jsonObject == null)
                return null;

            jsonObject["ncContentTypeAlias"] = jsonObject["elementType"]?.ToObject<string>();

            return _nestedContentSingleValueConverter.ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, "[" + jsonObject?.ToString() + "]", preview) as IPublishedElement;

        }
    }
}
