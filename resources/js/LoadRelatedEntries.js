(function($) {

Craft.LoadRelatedEntries = Garnish.Base.extend(
{
    $container: null,
    $resultsContainer: null,
    $paginationUrls: null,
    $editEntryUrls: null,
    $deleteEntryUrls: null,
	$spinner: null,
    section: 0,
    relatedEntryId: 0,
    currentPage: 0,
    pageEntryCount: 0,
    limit: 10,
    pagesToRedirectFrom: [],
	loading: false,

	init: function(params)
	{
		this.$container = $(params.container);
		this.$resultsContainer = $(params.resultsContainer);
		this.$paginationUrls = this.$container.find('.pagination a');
		this.$spinner = this.$container.find('.spinner');
        this.section = params.section;
        this.relatedEntryId = params.relatedEntryId;
        this.pagesToRedirectFrom = params.pagesToRedirectFrom;
        this.limit = params.limit;

        // Add load links for pagination
        this.addListener(this.$paginationUrls, 'click', 'onClick');

        // Load first set
        this.load(0);
	},

    onClick: function(event)
	{
        var page = $(event.currentTarget).data('page');
        this.load(page);
        event.preventDefault();
	},

    load: function(page)
    {
        if (this.loading) return;

        this.loading = true;
        this.$resultsContainer.html('');
        this.$spinner.removeClass('hidden');

        this.currentPage = page;

        this.$paginationUrls.removeClass('active');
        this.$paginationUrls.parent().find('[data-page='+page+']').addClass('active');

        var data = {
            offset: page * this.limit,
            limit: this.limit,
            section: this.section,
            relatedEntryId: this.relatedEntryId
        };

        Craft.postActionRequest('relatedEntries/entries/load', data, $.proxy(function(response, textStatus)
        {
            this.loading = false;
            this.$spinner.addClass('hidden');

            if (textStatus == 'success')
            {
                if(response.entries == '')
                {
                    this.$resultsContainer.html(Craft.t('No entries could be found.'));
                }
                else
                {
                    // Display entries
                    this.$resultsContainer.html(response.entries);

                    // Update entry count
                    this.pageEntryCount = this.$resultsContainer.find('table > tbody > tr').length;

                    // Add edit and delete functions
                    this.addEntryListeners();
                }
            }
        }, this));
    },

    addEntryListeners: function()
    {
        // Add edit entry links functionality
        if(this.$editEntryUrls !== null)
        {
            this.removeListener(this.$editEntryUrls, 'click');
        }
        this.$editEntryUrls = this.$container.find('a.edit-entry');
        this.addListener(this.$editEntryUrls, 'click', 'editEntry');

        // Add delete entry links functionality
        if(this.$deleteEntryUrls !== null)
        {
            this.removeListener(this.$deleteEntryUrls, 'click');
        }
        this.$deleteEntryUrls = this.$container.find('a.delete-entry');
        this.addListener(this.$deleteEntryUrls, 'click', 'deleteEntry');
    },

    editEntry: function(event)
    {
        var self = this;
        $.fancybox({
            href: $(event.currentTarget).attr('href'),
            type: 'iframe',
            padding: 0,
            width: '100%',
            afterLoad: function() {
                this.inner.find('iframe').on('load', function(event) {
                    if ($.inArray(event.currentTarget.contentWindow.location.href, self.pagesToRedirectFrom) >= 0) {
                        $.fancybox.close();
                    }
                });
            }
        });
        event.preventDefault();
    },

    deleteEntry: function(event)
    {
        var entryId = $(event.currentTarget).data('entry-id'),
            confirmation = confirm(Craft.t('Are you sure you want to delete this entry?'));

        if(confirmation)
        {
            Craft.postActionRequest('relatedEntries/entries/delete', { entryId: entryId }, $.proxy(function(response, textStatus)
            {
                if (textStatus == 'success' && response.result)
                {
                    Craft.cp.displayNotice(Craft.t('The entry has been deleted.'));
                    // Reload current page or previous if there aren't enough entries
                    if(this.pageEntryCount > 1)
                    {
                        this.load(this.currentPage);
                    }
                    else
                    {
                        this.load((this.currentPage > 0 ? this.currentPage - 1 : 0));
                        if(this.$paginationUrls.length > 1)
                        {
                            this.$paginationUrls.last().remove();
                        }
                    }
                }
            }, this));
        }
        event.preventDefault();
    }
});

})(jQuery);