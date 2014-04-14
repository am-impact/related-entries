<?php
namespace Craft;

class RelatedEntries_RelatedEntryFieldType extends BaseFieldType
{
	public function getName()
    {
	    return Craft::t('Related Entry');
    }

    public function getInputHtml($name, $value)
    {
	    craft()->templates->includeJsResource('relatedentries/lib/fancybox/jquery.fancybox.pack.js');
        craft()->templates->includeCssResource('relatedentries/lib/fancybox/jquery.fancybox.css');

	    craft()->templates->includeJsResource('relatedentries/js/LoadRelatedEntries.js');
	    craft()->templates->includeCssResource('relatedentries/css/relatedEntries.css');

	    craft()->templates->includeTranslations('No entries could be found.', 'Are you sure you want to delete this entry?', 'The entry has been deleted.');

        return craft()->templates->render('relatedentries/relatedentry/input', array(
            'settings'  => $this->getSettings(),
            'name' => $name
        ));
    }

    public function getSettingsHtml()
    {
        return craft()->templates->render('relatedentries/relatedentry/settings', array(
            'settings' => $this->getSettings(),
            'sections' => $this->getSections()
        ));
    }

    protected function defineSettings()
    {
        return array(
            'relatedSection' => array(AttributeType::String),
            'usePagination' => array(AttributeType::Bool),
            'entriesPerPage' => array(AttributeType::Number)
        );
    }

    public function prepSettings($settings)
    {
        if (!isset($settings['usePagination']))
        {
            $settings['usePagination'] = 0;
        }

        if (empty($settings['entriesPerPage']))
        {
            $settings['entriesPerPage'] = 0;   
        }

        return $settings;
    }

	private function getSections()
	{
		$sections = array();
		$craft_sections = craft()->sections->getAllSections();
	    foreach ($craft_sections as $section)
        {
            $sections[$section->id] = $section->name;
        }
		return $sections;
	}
}