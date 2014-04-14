<?php
/**
 * Related entries for Craft CMS
 *
 * @package   Related entries
 * @author    Frank Zwiers
 * @author    Hubert Prein
 */
namespace Craft;

class RelatedEntriesPlugin extends BasePlugin
{
    function getName()
    {
         return Craft::t('Related Entries');
    }

    function getVersion()
    {
        return '0.1';
    }

    function getDeveloper()
    {
        return 'a&m impact';
    }

    function getDeveloperUrl()
    {
        return 'http://www.am-impact.nl';
    }
}